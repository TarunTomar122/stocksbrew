#!/usr/bin/env python3
"""
Script 1: Fetch News Content
Reads stocks from input JSON, fetches news articles, and saves to news_content.json
"""

import json
import os
from datetime import datetime, timedelta
from newsapi import NewsApiClient
import sys
import requests
from bs4 import BeautifulSoup
import time


# Configuration
NEWS_API_KEY = "ad3828da77694151a23be433536ad81f"  # Your existing API key
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
INPUT_FILE = os.path.join(DATA_DIR, 'stocks_input.json')
OUTPUT_FILE = os.path.join(DATA_DIR, 'news_content.json')
PROCESSED_URLS_FILE = os.path.join(DATA_DIR, 'processed_urls.json')
URL_CONTENT_FILE = os.path.join(DATA_DIR, 'url_content.json')


# Headers for web scraping
HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) '
        'Chrome/91.0.4472.124 Safari/537.36'
    )
}


def load_processed_urls():
    """Load the set of already processed URLs and their content"""
    processed_urls = set()
    url_content = {}
    
    try:
        with open(PROCESSED_URLS_FILE, 'r') as f:
            processed_urls = set(json.load(f))
    except (FileNotFoundError, json.JSONDecodeError):
        processed_urls = set()
        
    try:
        with open(URL_CONTENT_FILE, 'r') as f:
            url_content = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        url_content = {}
        
    return processed_urls, url_content


def save_processed_urls(urls, url_content):
    """Save the set of processed URLs and their content"""
    os.makedirs(DATA_DIR, exist_ok=True)
    
    with open(PROCESSED_URLS_FILE, 'w') as f:
        json.dump(list(urls), f)
        
    with open(URL_CONTENT_FILE, 'w') as f:
        json.dump(url_content, f)


def fetch_full_article_content(url):
    """Fetch and extract the full content of an article from its URL"""
    try:
        # Add delay to be respectful to servers
        time.sleep(1)
        
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove unwanted elements
        unwanted = ['script', 'style', 'nav', 'header', 'footer', 'iframe']
        for element in soup.find_all(unwanted):
            element.decompose()
        
        # Try different methods to find the main content
        article_content = None
        
        # Method 1: Look for article tag
        if article_content is None:
            article = soup.find('article')
            if article:
                article_content = article.get_text(separator=' ', strip=True)
        
        # Method 2: Look for common content div classes
        if article_content is None:
            content_terms = ['article', 'content', 'story', 'body', 'text']
            content_divs = soup.find_all(
                ['div', 'section'],
                class_=lambda x: x and any(
                    term in str(x).lower() for term in content_terms
                )
            )
            if content_divs:
                longest = max(content_divs, key=lambda x: len(x.get_text()))
                article_content = longest.get_text(separator=' ', strip=True)
        
        # Method 3: If all else fails, get the longest text block
        if article_content is None:
            paragraphs = soup.find_all('p')
            if paragraphs:
                article_content = ' '.join(
                    p.get_text().strip() for p in paragraphs
                )
        
        if not article_content:
            return "Failed to extract article content"
        return article_content
        
    except Exception as e:
        err_msg = f"    ⚠️ Error fetching full content from {url}: {str(e)}"
        print(err_msg)
        return f"Error fetching content: {str(e)}"


def load_stocks_config():
    """Load stocks configuration from input JSON"""
    try:
        with open(INPUT_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ Input file not found: {INPUT_FILE}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON in input file: {e}")
        sys.exit(1)


def fetch_news_for_stock(stock_info, config, newsapi, processed_urls, url_content):
    """Fetch news articles for a single stock"""
    print(f"📰 Fetching news for {stock_info['company_name']}...")
    
    # Calculate date range - start from yesterday at 12:00 AM
    today = datetime.now()
    from_date = (today - timedelta(days=config['news_days_back'] + 1)).strftime('%Y-%m-%d')
    to_date = today.strftime('%Y-%m-%d')
    
    print(f"  📅 Fetching news from {from_date} to {to_date}")
    
    all_articles = []
    new_processed_urls = set()
    
    # Search for each term
    for search_term in stock_info['search_terms']:
        try:
            print(f"  🔍 Searching for: {search_term}")
            response = newsapi.get_everything(
                q=search_term,
                language=config['language'],
                sort_by='relevancy',
                from_param=from_date,
                to=to_date,
                page_size=config['max_articles_per_stock']
            )
            
            articles = response.get('articles', [])
            print(f"    Found {len(articles)} articles")
            
            # Add metadata and fetch full content for each article
            for article in articles:
                url = article['url']
                article['search_term'] = search_term
                article['fetched_at'] = datetime.now().isoformat()
                
                # Check if we have valid cached content
                cached_content = url_content.get(url)
                if url in processed_urls and cached_content:
                    print(f"    📄 Using cached content for: {url}")
                    article['full_content'] = cached_content
                else:
                    print(f"    📥 Fetching full content from: {url}")
                    content = fetch_full_article_content(url)
                    article['full_content'] = content
                    # Only cache and mark as processed if we got valid content
                    is_valid = (content and
                              not content.startswith("Error fetching content"))
                    if is_valid:
                        url_content[url] = content
                        new_processed_urls.add(url)
                
                all_articles.append(article)
            
        except Exception as e:
            print(f"    ❌ Error fetching news for '{search_term}': {str(e)}")
    
    # Update processed URLs with new ones
    processed_urls.update(new_processed_urls)
    
    print(f"  ✅ Total articles: {len(all_articles)}")
    return all_articles


def main():
    """Main function to fetch news for all stocks"""
    print("🚀 Starting news fetching process...")
    
    # Load configuration and processed URLs
    data = load_stocks_config()
    stocks = data['stocks']
    config = data['config']
    processed_urls, url_content = load_processed_urls()
    print(f"📋 Found {len(processed_urls)} previously processed URLs")
    
    # Initialize NewsAPI client
    try:
        newsapi = NewsApiClient(api_key=NEWS_API_KEY)
    except Exception as e:
        print(f"❌ Failed to initialize NewsAPI client: {e}")
        sys.exit(1)
    
    # Fetch news for all stocks
    news_data = {
        'metadata': {
            'generated_at': datetime.now().isoformat(),
            'total_stocks': len(stocks),
            'config': config
        },
        'stocks_news': []
    }
    
    for stock in stocks:
        articles = fetch_news_for_stock(
            stock, config, newsapi, processed_urls, url_content
        )
        
        stock_news = {
            'stock_info': stock,
            'articles_count': len(articles),
            'articles': articles
        }
        
        news_data['stocks_news'].append(stock_news)
    
    # Save processed URLs and content for future runs
    save_processed_urls(processed_urls, url_content)
    print(f"📋 Saved {len(processed_urls)} processed URLs for future runs")
    
    # Save to output file
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(news_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ News content saved to: {OUTPUT_FILE}")
        print("Summary:")
        for stock_news in news_data['stocks_news']:
            stock_name = stock_news['stock_info']['company_name']
            article_count = stock_news['articles_count']
            print(f"  - {stock_name}: {article_count} articles")
    
    except Exception as e:
        print(f"❌ Failed to save news content: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main() 