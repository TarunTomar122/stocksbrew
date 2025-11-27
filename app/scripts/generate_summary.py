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
from dotenv import load_dotenv
from scripts.db import client

# Configuration

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

def extract_json_from_text(text: str) -> str:
    """Extract a JSON object from the model response string.

    Handles code fences (```json ... ``` or ``` ... ```). If not found,
    falls back to substring between the first '{' and the last '}'.
    """
    if not isinstance(text, str):
        return "{}"
    t = text.strip()
    if '```json' in t:
        try:
            t = t.split('```json', 1)[1].split('```', 1)[0]
            return t.strip()
        except Exception:
            pass
    if '```' in t:
        try:
            t = t.split('```', 1)[1].split('```', 1)[0]
            return t.strip()
        except Exception:
            pass
    start = t.find('{')
    end = t.rfind('}')
    if start != -1 and end != -1 and end > start:
        return t[start:end+1]
    return t
INPUT_FILE = os.path.join(DATA_DIR, 'news_content.json')
OUTPUT_FILE = os.path.join(DATA_DIR, 'summaries.json')
BATCH_SIZE = 5  # Process stocks in batches to manage memory


def load_news_content():
    """Load news content from database"""
    today = datetime.now().strftime("%Y-%m-%d")

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

def is_non_material_summary(summary_json: Dict[str, Any]) -> bool:
    """Return True if the AI summary indicates no material news.

    We detect this conservatively based on the TL;DR text containing
    the phrase "no material news" (case-insensitive). This avoids saving
    placeholders and downstream empty newsletters.
    """
    try:
        tldr_text = str(summary_json.get('tldr', '') or '')
        if 'no material news' in tldr_text.strip().lower():
            return True
        # Optional additional guard: neutral with no key points is also likely non-material
        key_points = summary_json.get('key_points', []) or []
        sentiment = str(summary_json.get('sentiment', '') or '').lower()
        return (sentiment == 'neutral' and len(key_points) == 0 and tldr_text.strip() != '')
    except Exception:
        return False

def generate_summary(content, gemini_model):
    """Generate AI summary for stock news content using Gemini"""
    
    example_json = '''{
    "tldr": "📉 Company hit by $300M cyberattack — short-term pain expected.",
    "sentiment": "negative",
    "key_points": [
        "🔒 Cyberattack may cut profits by $300M due to online sales suspension. This is a major revenue loss for the company. It is expected to have a negative impact on the stock price.",
    ],
}'''

    empty_json = '''{
    "tldr": "No material news affecting stock price.",
    "sentiment": "neutral",
    "key_points": [],
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

    ### What to avoid:
    - NEVER suggest **buying**, **selling**, or **trading** a stock.  
    - DO NOT include:  
        - Buy/sell/accumulate/hold/exit  
        - Target prices (e.g., “Target ₹400”)  
        - Stop losses (e.g., “SL at ₹360”)  
        - Technical trading setups (e.g., breakout, support, RSI)

    ---

    ### Content to analyze:
    {content}

    ---

    ### Output format (as JSON):
    {example_json}

    ### NOTES:
    - Keep **tldr under 2 sentences**
    - Each key point must be detailed summary of the news in a easy to read format
    - Do NOT include unrelated business, HR, or CSR news
    - Never include more than 2 points in any category.
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
                try:
                    json_text = extract_json_from_text(summary)
                    summary_json = json.loads(json_text)
                except json.JSONDecodeError as e:
                    print(f"⚠️ Error parsing JSON for {stock_name}: {e}")
                    continue
                # Skip saving if the summary indicates no material news
                if is_non_material_summary(summary_json):
                    print(f"⏭️  Skipping {stock_name} — no material news.")
                else:
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


def main(api_key):
    """Main function to execute the script"""
    global INPUT_FILE, OUTPUT_FILE

    # Load news content
    news_content = load_news_content()
    
    # Initialize Gemini model
    genai.configure(api_key=api_key)
    gemini_model = genai.GenerativeModel("gemini-2.5-flash")

    # Process stocks in batches
    summaries = {}
    current_batch = []
    print("Generating summaries for regular stocks...", len(news_content['stocks_news']), news_content['stocks_news'][0])
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
    main(api_key=os.getenv("GEMINI_API_KEY_PROD"))

