#!/usr/bin/env python3
"""
Script 3: Generate Newsletter
Reads summaries JSON, processes through Gemini to refine and remove repetition,
then creates a beautiful HTML newsletter using templates.
"""

import json
import os
import sys
from datetime import datetime
import google.generativeai as genai
from jinja2 import Environment, FileSystemLoader
from .send_emails import send_newsletter_email
from scripts.db import client

# Configuration
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
TEMPLATES_DIR = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), 'templates'
)
OUTPUT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), 'output'
)

INPUT_FILE = os.path.join(DATA_DIR, 'summaries.json')

# Gemini API configuration
GEMINI_API_KEY = "AIzaSyAyycEffMJ-NaBNgp4hYKulRFcKvH9vNIo"  

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash-preview-05-20')


def load_hot_stocks_summaries():
    """Load hot stock summaries from database"""
    today = datetime.now().strftime("%Y-%m-%d")
    doc = client.stockbrew_stuff.hot_stocks_summaries.find_one({"date": today})
    if doc:
        return doc.get("summaries", {})
    return {}

def load_hot_stocks_refined_summaries():
    """Load refined hot stock summaries from database"""
    today = datetime.now().strftime("%Y-%m-%d")
    doc = client.stockbrew_stuff.hot_stocks_refined_summaries.find_one({"date": today})
    if doc:
        return doc.get("refined_summaries", {})
    return {}

def load_summaries(selected_stocks):
    """Load stock summaries from database"""
    today = datetime.now().strftime("%Y-%m-%d")
    doc = client.stockbrew_stuff.regular_stocks_summaries.find_one({"date": today})
    if doc:
        all_summaries = doc.get("summaries", {})
        # filter summaries to only include selected stocks
        selected_summaries = {}
        for stock in selected_stocks:
            if stock in all_summaries:
                selected_summaries[stock] = all_summaries[stock]
        return selected_summaries
    return {}


def refine_summaries(summaries, file_name=None):
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

    Here are the summaries:
    {summaries}

    Please provide the refined summaries in the exact same JSON format.
    """
    
    if len(summaries) == 0:
        return {}

    response = model.generate_content(
        prompt.format(summaries=json.dumps(summaries, indent=2))
    )
    
    try:
        # Extract JSON from the response
        refined_text = response.text
        # Find JSON content between triple backticks if present
        if '```json' in refined_text:
            refined_text = refined_text.split('```json')[1].split('```')[0]
        elif '```' in refined_text:
            refined_text = refined_text.split('```')[1].split('```')[0]
        
        if file_name:
            # save the refined text to a file
            with open(os.path.join(DATA_DIR, f'{file_name}_refined_summaries.json'), 'w', encoding='utf-8') as f:
                json.dump(json.loads(refined_text), f, indent=2)

        return json.loads(refined_text)
    except Exception as e:
        print(
            f"⚠️ Error parsing Gemini response, using original summaries: {e}"
        )
        return summaries


def generate_newsletter(summaries, hot_stocks=[]):
    """Generate the complete newsletter HTML"""
    # Set up Jinja2 environment
    env = Environment(
        loader=FileSystemLoader(TEMPLATES_DIR),
        trim_blocks=True,
        lstrip_blocks=True
    )
    
    # Load templates
    template = env.get_template('newsletter_template.html')

    if len(summaries) == 0 and len(hot_stocks) == 0:
        return ""

    # Prepare user stocks data
    user_stocks_data = []
    for company_name, data in summaries.items():
        if data.get('tldr'):  # Only include stocks with content
            stock_data = {
                'company_name': company_name,
                'sentiment': data['sentiment'].capitalize(),
                'sentiment_class': data['sentiment'].lower(),
                'tldr': data.get('tldr', ''),
                'key_points': data.get('key_points', []),
                'action_items': data.get('action_items', []),
                'has_key_points': bool(data.get('key_points')),
                'has_action_items': bool(data.get('action_items'))
            }
            user_stocks_data.append(stock_data)

    # Prepare hot stocks data
    hot_stocks_data = []
    for stock in hot_stocks:
        try:
            # Parse the JSON string if it's a string
            if isinstance(stock, str):
                stock_data = json.loads(stock)
            else:
                stock_data = stock

            formatted_stock = {
                'company_name': stock_data.get('stock_name', 'Hot Stock'),
                'sentiment': stock_data['sentiment'].capitalize(),
                'sentiment_class': stock_data['sentiment'].lower(),
                'tldr': stock_data['tldr'],
                'key_points': stock_data['key_points'],
                'action_items': stock_data['action_items'],
                'has_key_points': bool(stock_data['key_points']),
                'has_action_items': bool(stock_data['action_items'])
            }
            hot_stocks_data.append(formatted_stock)
        except (json.JSONDecodeError, KeyError, AttributeError) as e:
            print(f"Error processing hot stock: {e}")
            continue

    # Generate HTML with separate sections
    newsletter_html = template.render(
        date=datetime.now().strftime('%B %d, %Y'),
        user_stocks=user_stocks_data,
        hot_stocks=hot_stocks_data
    )
    
    return newsletter_html


def save_newsletter(html, email):
    """Save the newsletter HTML to a file"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    output_file = os.path.join(
        OUTPUT_DIR,
        f'newsletter_{email}_{datetime.now().strftime("%Y%m%d")}.html'
    )
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"✅ Newsletter saved to: {output_file}")
    except Exception as e:
        print(f"❌ Error saving newsletter: {e}")
        sys.exit(1)


def send_newsletter_email_to_subscriber(email, stocks):
    """Send the newsletter to a subscriber"""
    try:
        print(f"\n📧 Generating newsletter for {email}")
        selected_stocks = stocks.split(', ')

        # Load and refine summaries
        print("📚 Loading summaries and refining...")
        refined_summaries = refine_summaries(load_summaries(selected_stocks))

        # Generate newsletter
        print("📝 Generating newsletter...")
        newsletter_html = generate_newsletter(refined_summaries)
        
        # Send newsletter
        print("📧 Sending newsletter...")
        send_newsletter_email(newsletter_html, email)
        
        print("✨ Newsletter generation complete!")

    except Exception as e:
        print(f"❌ Error sending newsletter: {e}")
        sys.exit(1)


def main():
    """Main function to generate the newsletter"""
    print("🚀 Starting newsletter generation...")

    email = sys.argv[1]
    selected_stocks = sys.argv[2]
    print("selected_stocks", selected_stocks)
    selected_stocks = selected_stocks.split(', ')
    
    # Load and refine summaries
    print("📚 Loading summaries...")
    summaries = load_summaries(selected_stocks)
    
    print("🤖 Processing through Gemini...")
    refined_summaries = refine_summaries(summaries)
    
    # Generate and save newsletter
    print("📝 Generating newsletter...")
    newsletter_html = generate_newsletter(refined_summaries)
    
    print("💾 Saving newsletter...")
    save_newsletter(newsletter_html, email)
    
    print("✨ Newsletter generation complete!")


if __name__ == "__main__":
    main()

