#!/usr/bin/env python3
"""
Script 2 (Gemini Version): Generate Summaries
Reads news content JSON, processes through Gemini AI model to create bullet
point summaries, and saves to summaries.json
"""

import json
import os
import sys
import google.generativeai as genai

# Configuration
GEMINI_API_KEY = "AIzaSyAyycEffMJ-NaBNgp4hYKulRFcKvH9vNIo"  

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
INPUT_FILE = os.path.join(DATA_DIR, 'news_content.json')
OUTPUT_FILE = os.path.join(DATA_DIR, 'summaries.json')

# Load news content
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
INPUT_FILE = os.path.join(DATA_DIR, 'news_content.json')


def load_news_content():
    """Load news content from JSON file"""
    try:
        with open(INPUT_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ Input file not found: {INPUT_FILE}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON in input file: {e}")
        sys.exit(1)


def prepare_content_for_analysis(stock_news):
    """Prepare news content for AI analysis"""
    stock_info = stock_news['stock_info']
    articles = stock_news['articles']
    
    if not articles:
        return None
    
    content = f"Stock: {stock_info['company_name']} ({stock_info['symbol']})\n"
    content += "Recent News Articles:\n\n"
    
    for i, article in enumerate(articles, 1):  # Limit to top 10 articles
        content += f"{i}. Title: {article['title']}\n"
        if article.get('full_content'):
            full_content = article['full_content']
            content += f"   Content: {full_content}...\n"
        content += f"   URL: {article['url']}\n"
        content += f"   Published: {article['publishedAt']}\n\n"
    
    return content


def generate_summary(content, gemini_model):
    """Generate AI summary for stock news content using Gemini"""
    
    example_json = '''{
    "tldr": "📉 Company hit by $300M cyberattack — short-term pain expected.",
    "sentiment": "negative",
    "key_points": [
        "🔒 Cyberattack may cut profits by $300M",
        "📦 Online sales suspended = major revenue loss",
        "⚠️ Technical recovery costs could grow further"
    ],
    "action_items": [
        "👀 Watch for recovery timeline updates",
        "💰 Reassess short-term investment if holding",
        "📊 Monitor sector for similar cyber risks"
    ]
}'''

    empty_json = '''{
    "tldr": "No material news affecting stock price.",
    "sentiment": "neutral",
    "key_points": [],
    "action_items": []
}'''
    
    prompt = f"""
    You're given raw news content about a company from the last 24 hours. 
    Summarize only the parts that could affect the company's stock price.

    🎯 Your goal:
    Make it **ultra clear** for beginners who want quick, bite-sized insights.

    ### What to do:
    - Extract **only price-impacting information**
    - Make it **concise**, **easy to scan**, and **actionable**
    - Use **emojis**, **numbers**, and **bold keywords** to improve readability
    - Avoid technical jargon

    ---

    ### Content to analyze:
    {content}

    ---

    ### Output format (as JSON):
    {example_json}

    ### NOTES:
    - Keep **tldr under 2 sentences**
    - Each key point and action item must be **1 line**
    - Do NOT include unrelated business, HR, or CSR news
    - If news has **no major stock impact**, return:  
    {empty_json}
    """
    
    try:
        response = gemini_model.generate_content(prompt)
        return response.text
    
    except Exception as e:
        print(f"❌ Error generating summary: {e}")
        return None


def main():
    """Main function to execute the script"""
    # Load news content
    news_content = load_news_content()
    
    # Initialize Gemini model
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel("gemini-2.5-flash-preview-05-20")
    
    summaries = {}

    # Process each stock's news content
    for stock_news in news_content['stocks_news']:
        stock_name = stock_news['stock_info']['company_name']
        print(f"Processing {stock_name}...")
        content = prepare_content_for_analysis(stock_news)
        if content:
            summary = generate_summary(content, gemini_model)
            
            # parse the summary into a json object
            # strip off the ```json and ```
            summary = summary.strip('```json').strip('```')
            summary_json = json.loads(summary)
            summaries[stock_name] = summary_json
            print(f"summarized {stock_name}")

    # save the summaries to a json file
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(summaries, f)


if __name__ == "__main__":
    main()

