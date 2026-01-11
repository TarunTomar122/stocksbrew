"""
Test script to verify news fetching capabilities for a given topic/stock
Usage: python3 scripts/test_fetch_news.py
"""

import sys
sys.path.insert(0, '.')

from datetime import datetime, timezone
from scripts.fetch_news import (
    custom_fetch_latest_headlines,
    fetch_full_article_content
)
from newsapi import NewsApiClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# Initialize NewsAPI client
NEWSAPI_KEY = os.getenv('NEWSAPI_KEY')
newsapi = NewsApiClient(api_key=NEWSAPI_KEY) if NEWSAPI_KEY else None


def test_news_fetch_for_topic(topic: str, max_rss: int = 2, max_newsapi: int = 2):
    """
    Test news fetching for a given topic/company
    
    Args:
        topic: The search topic (e.g., "Microsoft Corporation", "Tesla")
        max_rss: Maximum number of articles to fetch from Google RSS (default: 2)
        max_newsapi: Maximum number of articles to fetch from NewsAPI (default: 2)
    """
    print(f"\n{'='*80}")
    print(f"🔍 Testing News Fetch for: {topic}")
    print(f"{'='*80}\n")
    
    all_articles = []
    
    # Test Google News RSS
    print(f"📰 Fetching from Google News RSS (limit: {max_rss})...")
    print(f"{'-'*80}")
    try:
        rss_headlines = custom_fetch_latest_headlines(topic, max_rss)
        print(f"✅ Found {len(rss_headlines)} articles from RSS\n")
        
        for i, article in enumerate(rss_headlines, 1):
            print(f"   {i}. {article['title']}")
            print(f"      Published: {article.get('published_at', 'N/A')}")
            url = article.get('url', '')
            print(f"      URL: {url[:80]}...")
            print()
            
            # Add to all_articles with common format
            all_articles.append({
                'title': article['title'],
                'link': article.get('url'),
                'published_at': article.get('published_at')
            })
        
    except Exception as e:
        print(f"❌ Error fetching from RSS: {e}\n")
        import traceback
        traceback.print_exc()
    
    # Test NewsAPI
    if newsapi:
        print(f"\n📡 Fetching from NewsAPI (limit: {max_newsapi})...")
        print(f"{'-'*80}")
        try:
            # Get articles from NewsAPI
            response = newsapi.get_everything(
                q=topic,
                language='en',
                sort_by='publishedAt',
                page_size=max_newsapi
            )
            
            newsapi_articles = response.get('articles', [])[:max_newsapi]
            print(f"✅ Found {len(newsapi_articles)} articles from NewsAPI\n")
            
            for i, article in enumerate(newsapi_articles, 1):
                print(f"   {i}. {article['title']}")
                print(f"      Source: {article['source']['name']}")
                print(f"      Published: {article['publishedAt']}")
                print(f"      URL: {article['url'][:80]}...")
                print()
                
                # Convert to common format
                all_articles.append({
                    'title': article['title'],
                    'source': article['source']['name'],
                    'published_at': article['publishedAt'],
                    'link': article['url']
                })
        except Exception as e:
            print(f"❌ Error fetching from NewsAPI: {e}\n")
    else:
        print(f"\n⚠️  NewsAPI key not found, skipping NewsAPI test\n")
    
    # Test full content fetching for first article
    if all_articles:
        print(f"\n📄 Testing Full Content Fetch (first article)...")
        print(f"{'-'*80}")
        test_article = all_articles[0]
        print(f"Title: {test_article.get('title', 'N/A')}")
        print(f"URL: {test_article.get('link', 'N/A')}\n")
        
        url = test_article.get('link')
        if url:
            try:
                full_content = fetch_full_article_content(url)
                if full_content and not full_content.startswith("Failed") and not full_content.startswith("Error"):
                    print(f"✅ Successfully fetched content ({len(full_content)} chars)")
                    print(f"\nFirst 500 chars:")
                    print(f"{'-'*80}")
                    print(full_content[:500])
                    print("...")
                else:
                    print(f"⚠️  {full_content}")
            except Exception as e:
                print(f"❌ Error fetching content: {e}")
        else:
            print("⚠️  No URL found in article")
    
    # Summary
    print(f"\n{'='*80}")
    print(f"📊 Summary")
    print(f"{'='*80}")
    print(f"   Total articles fetched: {len(all_articles)}")
    print(f"{'='*80}\n")


if __name__ == "__main__":
    print("\n" + "="*80)
    print("🧪 COMPARING: Old vs New Search Term Format")
    print("="*80)
    
    # Compare old restrictive format vs new simple format
    test_cases = [
        ("Microsoft Corporation", "NEW: Just company name"),
        ("microsoft corporation company stocks news", "OLD: With 'company stocks news' suffix"),
        ("Reliance Industries Limited", "NEW: Just company name"),
        ("reliance industries limited company stocks news", "OLD: With 'company stocks news' suffix"),
    ]
    
    for search_term, description in test_cases:
        print(f"\n{'='*80}")
        print(f"Testing: {search_term}")
        print(f"Format: {description}")
        print(f"{'='*80}")
        test_news_fetch_for_topic(search_term, max_rss=3, max_newsapi=0)
        
    print("\n✅ All tests complete!")

