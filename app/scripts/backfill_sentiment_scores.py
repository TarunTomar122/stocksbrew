#!/usr/bin/env python3
"""
Backfill Script: Add sentiment scores to existing summaries in database
This script processes all existing summaries and adds sentiment_score field
"""

import json
import os
import sys
from datetime import datetime, timedelta
import google.generativeai as genai
from dotenv import load_dotenv
from scripts.db import client
import time

# Load environment variables from app/.env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# Gemini API configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY_PROD")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')


def extract_json_from_text(text: str) -> str:
    """Extract a JSON object from the model response string."""
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


def generate_sentiment_score(summary_data):
    """Generate sentiment score for a given summary using Gemini"""
    
    prompt = f"""
    You are analyzing a stock market summary. Based on the content, assign a sentiment score between -1 and 1.
    
    Guidelines for sentiment scoring:
    - -1.0 to -0.6: Very negative (major losses, scandals, regulatory issues)
    - -0.5 to -0.2: Moderately negative (missed targets, minor concerns)
    - -0.1 to +0.1: Neutral (routine news with minimal impact)
    - +0.2 to +0.5: Moderately positive (good results, minor wins)
    - +0.6 to +1.0: Very positive (major contracts, breakthrough results)
    
    Use the full range - don't default to 0 easily. Consider the actual impact on stock price.
    
    Summary data:
    {json.dumps(summary_data, indent=2)}
    
    Return ONLY a JSON object with the sentiment_score field:
    {{"sentiment_score": -0.5}}
    """
    
    try:
        response = model.generate_content(prompt)
        json_text = extract_json_from_text(response.text)
        result = json.loads(json_text)
        return result.get('sentiment_score', 0)
    except Exception as e:
        print(f"    ⚠️ Error generating sentiment score: {e}")
        # Fallback: convert categorical sentiment to numeric
        sentiment = summary_data.get('sentiment', 'neutral').lower()
        if sentiment == 'positive':
            return 0.5
        elif sentiment == 'negative':
            return -0.5
        else:
            return 0


def backfill_regular_stocks_summaries():
    """Backfill sentiment scores for regular stocks summaries"""
    print("📊 Backfilling regular stocks summaries (last 15 days)...")
    
    collection = client.stockbrew_stuff.regular_stocks_summaries
    
    # Calculate date range (last 15 days)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=15)
    
    # Format dates as YYYY-MM-DD
    start_date_str = start_date.strftime("%Y-%m-%d")
    end_date_str = end_date.strftime("%Y-%m-%d")
    
    print(f"Processing documents from {start_date_str} to {end_date_str}")
    
    # Get documents from last 15 days only
    documents = list(collection.find({
        "date": {
            "$gte": start_date_str,
            "$lte": end_date_str
        }
    }).sort("date", -1))
    
    print(f"Found {len(documents)} documents to process")
    
    updated_count = 0
    
    for doc in documents:
        date = doc.get('date', 'unknown')
        summaries = doc.get('summaries', {})
        
        if not summaries:
            print(f"  ⏭️  Skipping {date} - no summaries")
            continue
            
        print(f"\n  📅 Processing {date} ({len(summaries)} stocks)...")
        updated_summaries = {}
        
        for company_name, summary in summaries.items():
            # Check if sentiment_score already exists
            if 'sentiment_score' in summary and summary['sentiment_score'] is not None:
                print(f"    ✓ {company_name} - already has sentiment_score")
                updated_summaries[company_name] = summary
                continue
            
            print(f"    🔄 Processing {company_name}...")
            
            # Generate sentiment score
            sentiment_score = generate_sentiment_score(summary)
            
            # Update summary with sentiment score
            summary['sentiment_score'] = sentiment_score
            updated_summaries[company_name] = summary
            
            print(f"    ✅ {company_name} - added sentiment_score: {sentiment_score}")
            
            # Rate limiting - wait 2 seconds between API calls
            time.sleep(2)
        
        # Update document in database
        collection.update_one(
            {"_id": doc['_id']},
            {"$set": {"summaries": updated_summaries}}
        )
        
        updated_count += 1
        print(f"  ✅ Updated {date}")
    
    print(f"\n✨ Backfill complete! Updated {updated_count} documents")


def backfill_refined_summaries():
    """Backfill sentiment scores for refined summaries"""
    print("\n📊 Backfilling refined stocks summaries (last 15 days)...")
    
    collection = client.stockbrew_stuff.regular_stocks_refined_summaries
    
    # Calculate date range (last 15 days)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=15)
    
    # Format dates as YYYY-MM-DD
    start_date_str = start_date.strftime("%Y-%m-%d")
    end_date_str = end_date.strftime("%Y-%m-%d")
    
    print(f"Processing documents from {start_date_str} to {end_date_str}")
    
    # Get documents from last 15 days only
    documents = list(collection.find({
        "date": {
            "$gte": start_date_str,
            "$lte": end_date_str
        }
    }).sort("date", -1))
    
    print(f"Found {len(documents)} documents to process")
    
    updated_count = 0
    
    for doc in documents:
        date = doc.get('date', 'unknown')
        refined_summaries = doc.get('refined_summaries', {})
        
        if not refined_summaries:
            print(f"  ⏭️  Skipping {date} - no refined summaries")
            continue
            
        print(f"\n  📅 Processing {date} ({len(refined_summaries)} stocks)...")
        updated_summaries = {}
        
        for company_name, summary in refined_summaries.items():
            # Check if sentiment_score already exists
            if 'sentiment_score' in summary and summary['sentiment_score'] is not None:
                print(f"    ✓ {company_name} - already has sentiment_score")
                updated_summaries[company_name] = summary
                continue
            
            print(f"    🔄 Processing {company_name}...")
            
            # Generate sentiment score
            sentiment_score = generate_sentiment_score(summary)
            
            # Update summary with sentiment score
            summary['sentiment_score'] = sentiment_score
            updated_summaries[company_name] = summary
            
            print(f"    ✅ {company_name} - added sentiment_score: {sentiment_score}")
            
            # Rate limiting - wait 2 seconds between API calls
            time.sleep(2)
        
        # Update document in database
        collection.update_one(
            {"_id": doc['_id']},
            {"$set": {"refined_summaries": updated_summaries}}
        )
        
        updated_count += 1
        print(f"  ✅ Updated {date}")
    
    print(f"\n✨ Backfill complete! Updated {updated_count} documents")


def main():
    """Main function to execute backfill"""
    print("🚀 Starting sentiment score backfill...\n")
    
    try:
        # Backfill regular summaries
        backfill_regular_stocks_summaries()
        
        # Backfill refined summaries
        backfill_refined_summaries()
        
        print("\n✨ All backfills completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Error during backfill: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()

