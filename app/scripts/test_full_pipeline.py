#!/usr/bin/env python3
"""
Full pipeline test script - fetch news, generate summary, send newsletter
Tests everything without saving to database
"""

import json
import os
import sys
from datetime import datetime, timedelta
import google.generativeai as genai
from jinja2 import Environment, FileSystemLoader
from dotenv import load_dotenv

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from newsapi import NewsApiClient
from scripts.fetch_news import custom_fetch_latest_headlines, fetch_full_article_content
from scripts.send_emails import send_newsletter_email
from scripts.db import client

# Configuration
TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'templates')

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# API Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY_PROD")
NEWS_API_KEY = os.getenv("NEWS_API_KEY_PROD")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

# Test stocks - just 1 for speed
TEST_STOCKS = [
    {
        "company_name": "Microsoft Corporation",
        "symbol": "MSFT",
        "search_terms": ["Microsoft"]
    }
]


def fetch_news_for_stock(stock_info):
    """Fetch news for a stock from multiple sources (in-memory, no DB)"""
    print(f"\n📰 Fetching news for {stock_info['company_name']}...")
    
    all_articles = []
    search_term = stock_info['search_terms'][0]
    
    # Source 1: Google News RSS (get 1 article)
    print(f"  🔍 Source 1: Google News RSS - '{search_term}'")
    headlines = custom_fetch_latest_headlines(search_term, 2)
    print(f"    Found {len(headlines)} headlines from RSS")
    
    for article in headlines[:1]:  # Get 1 from Google RSS
        url = article.get('url')
        if url:
            print(f"    📥 Fetching: {url[:60]}...")
            content = fetch_full_article_content(url)
            article['full_content'] = content
            article['source'] = 'Google RSS'
            all_articles.append(article)
    
    # Source 2: NewsAPI (get 1 article)
    print(f"  🔍 Source 2: NewsAPI - '{search_term}'")
    try:
        newsapi = NewsApiClient(api_key=NEWS_API_KEY)
        today = datetime.now()
        from_date = (today - timedelta(days=1)).strftime('%Y-%m-%d')
        to_date = today.strftime('%Y-%m-%d')
        
        response = newsapi.get_everything(
            q=search_term,
            language='en',
            sort_by='relevancy',
            from_param=from_date,
            to=to_date,
            page_size=2
        )
        
        newsapi_articles = response.get('articles', [])
        print(f"    Found {len(newsapi_articles)} articles from NewsAPI")
        
        # Get 1 from NewsAPI
        for article in newsapi_articles[:1]:
            url = article.get('url')
            if url:
                print(f"    📥 Fetching: {url[:60]}...")
                content = fetch_full_article_content(url)
                article['full_content'] = content
                article['source'] = 'NewsAPI'
                all_articles.append(article)
    except Exception as e:
        print(f"    ⚠️ NewsAPI error: {e}")
    
    print(f"  ✅ Total articles: {len(all_articles)} (1 RSS + 1 NewsAPI)")
    return all_articles


def generate_summary_for_stock(company_name, articles):
    """Generate AI summary with sentiment (in-memory, no DB)"""
    print(f"\n🤖 Generating summary for {company_name}...")
    
    if not articles:
        print("  ⚠️ No articles to summarize")
        return None
    
    # Prepare news content
    news_content = []
    for i, article in enumerate(articles, 1):
        content = article.get('full_content', '')
        if content and not content.startswith("Error") and not content.startswith("Failed"):
            news_content.append(f"Article {i}: {content[:1000]}")  # Limit content length
    
    if not news_content:
        print("  ⚠️ No valid article content")
        return None
    
    combined_content = "\n\n".join(news_content)
    
    # AI Prompt
    prompt = f"""
    Analyze the following news articles about {company_name} and provide:
    
    1. A concise 2-3 sentence summary (tldr)
    2. Sentiment classification: "Positive", "Negative", or "Neutral"
    3. Sentiment score between -1.0 and 1.0 where:
       - Very negative: -1.0 to -0.6
       - Moderately negative: -0.6 to -0.2
       - Neutral: -0.2 to 0.2
       - Moderately positive: 0.2 to 0.6
       - Very positive: 0.6 to 1.0
    
    News Content:
    {combined_content[:3000]}
    
    Respond in JSON format:
    {{
        "tldr": "...",
        "sentiment": "Positive/Negative/Neutral",
        "sentiment_score": 0.5
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text
        
        # Extract JSON
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0]
        elif '```' in text:
            text = text.split('```')[1].split('```')[0]
        
        result = json.loads(text)
        print(f"  ✅ Summary generated - Sentiment: {result['sentiment']} ({result['sentiment_score']})")
        return result
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return None


def get_sentiment_history(company_name, days=5):
    """Get sentiment history from DB (read-only)"""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days - 1)
    
    history = []
    for i in range(days):
        current_date = start_date + timedelta(days=i)
        date_str = current_date.strftime("%Y-%m-%d")
        
        doc = client.stockbrew_stuff.regular_stocks_summaries.find_one({"date": date_str})
        if doc and "summaries" in doc and company_name in doc["summaries"]:
            stock_data = doc["summaries"][company_name]
            sentiment_score = stock_data.get("sentiment_score", 0)
            date_label = current_date.strftime("%b %d")
            
            history.append({
                "date": date_str,
                "date_label": date_label,
                "score": sentiment_score
            })
    
    return history


def generate_newsletter(stock_summaries):
    """Generate newsletter HTML"""
    print(f"\n📝 Generating newsletter...")
    
    env = Environment(
        loader=FileSystemLoader(TEMPLATES_DIR),
        trim_blocks=True,
        lstrip_blocks=True
    )
    
    template = env.get_template('newsletter_template_v2.html')
    
    # Prepare data
    user_stocks_data = []
    for stock in stock_summaries:
        if stock['summary']:
            user_stocks_data.append({
                'company_name': stock['company_name'],
                'sentiment': stock['summary']['sentiment'],
                'sentiment_class': stock['summary']['sentiment'].lower(),
                'tldr': stock['summary']['tldr'],
                'sentiment_history': stock['sentiment_history']
            })
    
    if not user_stocks_data:
        return None
    
    newsletter_html = template.render(
        date=datetime.now().strftime('%B %d, %Y'),
        user_stocks=user_stocks_data,
        hot_stocks=[]
    )
    
    print(f"  ✅ Newsletter generated for {len(user_stocks_data)} stocks")
    return newsletter_html


def main():
    """Run full pipeline test"""
    print("🚀 Starting Full Pipeline Test")
    print("=" * 60)
    print(f"Testing with {len(TEST_STOCKS)} stocks")
    print(f"Target: tomartarun2001@gmail.com")
    print(f"Mode: IN-MEMORY (No DB writes)")
    print("=" * 60)
    
    stock_summaries = []
    
    # Step 1: Fetch news
    print("\n" + "=" * 60)
    print("STEP 1: FETCH NEWS")
    print("=" * 60)
    
    for stock in TEST_STOCKS:
        articles = fetch_news_for_stock(stock)
        stock_summaries.append({
            'company_name': stock['company_name'],
            'articles': articles,
            'summary': None,
            'sentiment_history': []
        })
    
    # Step 2: Generate summaries
    print("\n" + "=" * 60)
    print("STEP 2: GENERATE SUMMARIES")
    print("=" * 60)
    
    for stock in stock_summaries:
        summary = generate_summary_for_stock(stock['company_name'], stock['articles'])
        stock['summary'] = summary
        
        # Get historical sentiment for chart
        if summary:
            history = get_sentiment_history(stock['company_name'], days=5)
            stock['sentiment_history'] = history
            print(f"  📊 Found {len(history)} days of historical sentiment")
    
    # Step 3: Generate newsletter
    print("\n" + "=" * 60)
    print("STEP 3: GENERATE NEWSLETTER")
    print("=" * 60)
    
    newsletter_html = generate_newsletter(stock_summaries)
    
    if not newsletter_html:
        print("❌ No newsletter content generated")
        return
    
    # Step 4: Send email
    print("\n" + "=" * 60)
    print("STEP 4: SEND EMAIL")
    print("=" * 60)
    
    try:
        send_newsletter_email(newsletter_html, "tomartarun2001@gmail.com")
        print("✅ Newsletter sent successfully!")
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        # Save to file for debugging
        output_file = "/tmp/test_newsletter_full_pipeline.html"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(newsletter_html)
        print(f"💾 Newsletter saved to {output_file}")
    
    print("\n" + "=" * 60)
    print("✨ FULL PIPELINE TEST COMPLETE!")
    print("=" * 60)


if __name__ == "__main__":
    main()

