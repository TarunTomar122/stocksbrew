#!/usr/bin/env python3
"""
Test script to generate and send newsletter from a previous day's data
"""

import json
import os
import sys
from datetime import datetime, timedelta
import google.generativeai as genai
from jinja2 import Environment, FileSystemLoader
from dotenv import load_dotenv

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from scripts.db import client
from scripts.send_emails import send_newsletter_email

# Configuration
TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'templates')

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# Gemini API configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY_PROD")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')


def get_sentiment_history(stock_name, from_date, days=5):
    """Get sentiment score history for a stock over the last N days from a specific date"""
    end_date = datetime.strptime(from_date, "%Y-%m-%d")
    start_date = end_date - timedelta(days=days - 1)
    
    history = []
    for i in range(days):
        current_date = start_date + timedelta(days=i)
        date_str = current_date.strftime("%Y-%m-%d")
        
        doc = client.stockbrew_stuff.regular_stocks_summaries.find_one({"date": date_str})
        if doc and "summaries" in doc and stock_name in doc["summaries"]:
            stock_data = doc["summaries"][stock_name]
            sentiment_score = stock_data.get("sentiment_score", 0)
            
            # Format date label (e.g., "Jan 5")
            date_label = current_date.strftime("%b %d")
            
            history.append({
                "date": date_str,
                "date_label": date_label,
                "score": sentiment_score
            })
    
    return history


def load_summaries_from_date(selected_stocks, test_date):
    """Load stock summaries from database for a specific date"""
    doc = client.stockbrew_stuff.regular_stocks_summaries.find_one({"date": test_date})
    if doc:
        all_summaries = doc.get("summaries", {})
        selected_summaries = {}
        for stock in selected_stocks:
            if stock in all_summaries:
                summary = all_summaries[stock]
                tldr_text = str(summary.get("tldr", "") or "").strip().lower()
                key_points = summary.get("key_points", []) or []
                sentiment = str(summary.get("sentiment", "") or "").lower()
                # Skip non-material placeholders
                is_non_material = (
                    "no material news" in tldr_text or (sentiment == "neutral" and len(key_points) == 0 and tldr_text != "")
                )
                if not is_non_material:
                    selected_summaries[stock] = summary
        return selected_summaries
    return {}


def refine_summaries(summaries):
    """Process summaries through Gemini to refine and remove repetition"""
    prompt = """
    You are a financial newsletter editor. I will provide you with summaries of
    multiple stocks. Your task is to:
    1. Identify and remove any redundant information across different stocks
    2. Ensure each stock's summary is unique and focused on company-specific news
    3. Keep the same JSON structure but refine the content
    4. Maintain the sentiment and general structure of each summary
    5. Keep the language professional but engaging
    6. Remove the stocks that have no news affecting stock price
    7. Reduce the overall length of the summaries    
    8. Remove any buy/sell/trade/accumulate/hold/exit or target price recommendations
    9. Remove any markdown formatting like ** for bold or * for italic from the summaries

    Here are the summaries:
    {summaries}

    Please provide the refined summaries in the exact same JSON format.
    """
    
    if len(summaries) == 0:
        return {}
    
    try:
        response = model.generate_content(
            prompt.format(summaries=json.dumps(summaries, indent=2))
        )
        refined_text = response.text
        # Find JSON content between triple backticks if present
        if '```json' in refined_text:
            refined_text = refined_text.split('```json')[1].split('```')[0]
        elif '```' in refined_text:
            refined_text = refined_text.split('```')[1].split('```')[0]
        
        return json.loads(refined_text)
    except Exception as e:
        print(f"⚠️ Error parsing Gemini response, using original summaries: {e}")
        return summaries


def generate_newsletter(summaries, test_date):
    """Generate the complete newsletter HTML"""
    env = Environment(
        loader=FileSystemLoader(TEMPLATES_DIR),
        trim_blocks=True,
        lstrip_blocks=True
    )
    
    template = env.get_template('newsletter_template_v2.html')

    if len(summaries) == 0:
        return ""

    # Prepare user stocks data
    user_stocks_data = []
    for company_name, data in summaries.items():
        if data.get('tldr'):
            sentiment_history = get_sentiment_history(company_name, test_date, days=5)
            
            stock_data = {
                'company_name': company_name,
                'sentiment': data['sentiment'].capitalize(),
                'sentiment_class': data['sentiment'].lower(),
                'tldr': data.get('tldr', ''),
                'sentiment_history': sentiment_history
            }
            user_stocks_data.append(stock_data)

    newsletter_html = template.render(
        date=datetime.strptime(test_date, "%Y-%m-%d").strftime('%B %d, %Y'),
        user_stocks=user_stocks_data,
        hot_stocks=[]
    )
    
    return newsletter_html


def main():
    """Main function"""
    print("🧪 Starting newsletter test generation...")
    
    # Configuration
    email = "tomartarun2001@gmail.com"
    test_date = (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d")  # 2 days ago
    
    print(f"📅 Using test date: {test_date}")
    print(f"📧 Sending to: {email}")
    
    # Get all available stocks for that date
    doc = client.stockbrew_stuff.regular_stocks_summaries.find_one({"date": test_date})
    if not doc or "summaries" not in doc:
        print(f"❌ No data found for date {test_date}")
        print("\n📋 Available dates in database:")
        dates = client.stockbrew_stuff.regular_stocks_summaries.find({}, {"date": 1}).sort("date", -1).limit(10)
        for d in dates:
            print(f"   - {d['date']}")
        return
    
    available_stocks = list(doc["summaries"].keys())
    print(f"📊 Found {len(available_stocks)} stocks with data for {test_date}")
    
    # Select first 5 stocks that have material news
    selected_stocks = []
    for stock in available_stocks[:15]:  # Check first 15 to find 5 with material news
        summary = doc["summaries"][stock]
        tldr_text = str(summary.get("tldr", "") or "").strip().lower()
        sentiment = str(summary.get("sentiment", "") or "").lower()
        key_points = summary.get("key_points", []) or []
        
        is_non_material = (
            "no material news" in tldr_text or 
            (sentiment == "neutral" and len(key_points) == 0 and tldr_text != "")
        )
        
        if not is_non_material:
            selected_stocks.append(stock)
            if len(selected_stocks) == 5:
                break
    
    print(f"✅ Selected stocks: {', '.join(selected_stocks)}")
    
    # Load summaries
    print("\n📚 Loading summaries...")
    summaries = load_summaries_from_date(selected_stocks, test_date)
    print(f"   Found {len(summaries)} stocks with material news")
    
    if len(summaries) == 0:
        print("❌ No material news found for selected stocks")
        return
    
    # Refine summaries
    print("\n🤖 Refining summaries with Gemini...")
    refined_summaries = refine_summaries(summaries)
    print(f"   Refined to {len(refined_summaries)} stocks")
    
    # Generate newsletter
    print("\n📝 Generating newsletter...")
    newsletter_html = generate_newsletter(refined_summaries, test_date)
    
    if not newsletter_html or newsletter_html.strip() == "":
        print("❌ Newsletter generation failed")
        return
    
    print("✅ Newsletter generated successfully!")
    
    # Send email
    print(f"\n📧 Sending newsletter to {email}...")
    try:
        send_newsletter_email(newsletter_html, email)
        print("✅ Newsletter sent successfully!")
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        # Save to file for debugging
        output_file = f"/tmp/test_newsletter_{test_date}.html"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(newsletter_html)
        print(f"💾 Newsletter saved to {output_file} for debugging")
    
    print("\n✨ Test complete!")


if __name__ == "__main__":
    main()

