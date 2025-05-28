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
from typing import Dict, Any
import gc
import time
from datetime import datetime
from scripts.db import client

# Configuration

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
INPUT_FILE = os.path.join(DATA_DIR, 'news_content.json')
OUTPUT_FILE = os.path.join(DATA_DIR, 'summaries.json')
BATCH_SIZE = 5  # Process stocks in batches to manage memory


def load_news_content(hot_stocks=False):
    """Load news content from database"""
    today = datetime.now().strftime("%Y-%m-%d")
    
    if hot_stocks:
        doc = client.stockbrew_stuff.hot_stocks_news.find_one({"date": today})
    else:
        doc = client.stockbrew_stuff.regular_stocks_news.find_one({"date": today})
    
    if doc:
        return doc.get("news_data", {})
    else:
        print(f"❌ No news data found for {today}")
        return {"stocks_news": []}


def prepare_content_for_analysis(stock_news):
    """Prepare news content for AI analysis"""
    stock_info = stock_news['stock_info']
    articles = stock_news['articles']
    
    if not articles:
        return None
    
    content = f"Stock: {stock_info['company_name']} ({stock_info['symbol']})\n"
    content += "Recent News Articles:\n\n"
    
    for i, article in enumerate(articles[:5], 1):  # Limit to top 5 articles
        content += f"{i}. Title: {article['title']}\n"
        if article.get('full_content'):
            # Truncate content to manage memory
            full_content = (
                article['full_content'][:20000] if article['full_content'] else ""
            )
            content += f"   Content: {full_content}...\n"
        content += f"   URL: {article['url']}\n"
    
    return content


def generate_summary_for_hot_stocks(content, gemini_model):
    prompt = f"""
        Analyze the provided news content and extract information about hot stocks 
        and trading opportunities. Return the analysis in JSON format.

        For each stock mentioned with clear trading setup, provide:
        - A brief TLDR (max 2 sentences)
        - Overall sentiment (positive/negative/neutral)
        - 3-5 key technical or fundamental points with emojis
        - 2-3 specific action items with price levels

        Format each point as a clear, actionable statement with an emoji.
        Include exact price targets and stop losses if available.

        ### Content to analyze:
        {content}

        ### Response format:
        Return ONLY a JSON array of stock summaries. Each summary should have this structure:
        {{  
            "stock_name": "Stock name",
            "tldr": "Brief description of the opportunity",
            "sentiment": "positive/negative/neutral",
            "key_points": [
                "📈 Point 1 with specific numbers",
                "🎯 Point 2 with specific levels",
                "⚠️ Risk point if any"
            ],
            "action_items": [
                "👉 Specific action with price level",
                "🛑 Stop loss level"
            ]
        }}
    """
    try:
        response = gemini_model.generate_content(prompt)
        summary = response.text.strip()
        
        # If response is wrapped in code blocks, remove them
        if summary.startswith('```') and summary.endswith('```'):
            summary = summary.strip('`')
            if summary.startswith('json\n'):
                summary = summary[5:]
        
        # Clear memory
        del response, prompt
        gc.collect()
        
        return summary
    
    except Exception as e:
        print(f"❌ Error generating summary: {e}")
        return None


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
        summary = response.text
        
        # Clear memory
        del response, prompt
        gc.collect()
        
        return summary
    
    except Exception as e:
        print(f"❌ Error generating summary: {e}")
        return None


def process_stock_batch(batch, gemini_model):
    """Process a batch of stocks and return their summaries"""
    summaries = {}
    
    for stock_news in batch:
        stock_name = stock_news['stock_info']['company_name']
        print(f"Processing {stock_name}...")
        
        content = prepare_content_for_analysis(stock_news)
        if content:
            summary = generate_summary(content, gemini_model)
            if summary:
                # parse the summary into a json object
                # strip off the ```json and ```
                summary = summary.strip('```json').strip('```')
                summary_json = json.loads(summary)
                summaries[stock_name] = summary_json
                print(f"summarized {stock_name}")
        
        # Clear memory
        del content, stock_news
        gc.collect()
    
    # Save batch of summaries to file (for backward compatibility)
    try:
        # Load existing summaries
        try:
            with open(OUTPUT_FILE, 'r') as f:
                existing_summaries = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            existing_summaries = {}
        
        # Update with new summaries
        existing_summaries.update(summaries)
        
        # Save updated summaries
        with open(OUTPUT_FILE, 'w') as f:
            json.dump(existing_summaries, f)
            
    except Exception as e:
        print(f"❌ Error saving summaries: {e}")
    
    return summaries


def main(api_key, hot_stocks=False):
    """Main function to execute the script"""
    global INPUT_FILE, OUTPUT_FILE
    if hot_stocks:
        INPUT_FILE = os.path.join(DATA_DIR, 'hot_stocks_news_content.json')
        OUTPUT_FILE = os.path.join(DATA_DIR, 'hot_stocks_summaries.json')

    # Load news content
    news_content = load_news_content(hot_stocks)
    
    # Initialize Gemini model
    genai.configure(api_key=api_key)
    gemini_model = genai.GenerativeModel("gemini-2.5-flash-preview-05-20")
    
    if hot_stocks:
        summaries = {}
        for stock_news in news_content['stocks_news']:
            content = prepare_content_for_analysis(stock_news)
            if content:
                summary = generate_summary_for_hot_stocks(content, gemini_model)
                if summary:
                    try:
                        # Parse the summary as JSON
                        summary_json = json.loads(summary)
                        summaries[stock_news['stock_info']['company_name']] = summary_json
                        print(f"Summarized {stock_news['stock_info']['company_name']}")
                    except json.JSONDecodeError as e:
                        print(f"Error parsing summary: {e}")
                        continue
        
        # save the summaries in the database
        client.stockbrew_stuff.hot_stocks_summaries.update_one(
            {"date": datetime.now().strftime("%Y-%m-%d")},
            {"$set": {"summaries": summaries}},
            upsert=True
        )

        # Save the summaries
        with open(OUTPUT_FILE, 'w') as f:
            json.dump(summaries, f, indent=2)
        return summaries

    # Process stocks in batches
    summaries = {}
    current_batch = []
    for stock_news in news_content['stocks_news']:
        current_batch.append(stock_news)
        
        if len(current_batch) >= BATCH_SIZE:
            batch_summaries = process_stock_batch(current_batch, gemini_model)
            summaries.update(batch_summaries)
            current_batch = []
            gc.collect()  # Force garbage collection between batches
            time.sleep(30)
        
    
    # Process remaining stocks
    if current_batch:
        batch_summaries = process_stock_batch(current_batch, gemini_model)
        summaries.update(batch_summaries)
    
    # Save regular stocks summaries to database
    client.stockbrew_stuff.regular_stocks_summaries.update_one(
        {"date": datetime.now().strftime("%Y-%m-%d")},
        {"$set": {"summaries": summaries}},
        upsert=True
    )
    
    return summaries


if __name__ == "__main__":
    main(api_key="AIzaSyAyycEffMJ-NaBNgp4hYKulRFcKvH9vNIo")

