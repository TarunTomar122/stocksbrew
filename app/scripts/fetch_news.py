#!/usr/bin/env python3
"""
Script 1: Fetch News Content
Reads stocks from input JSON, fetches news articles, and saves to news_content.json
"""

import json
import os
from datetime import datetime, timedelta, timezone
from newsapi import NewsApiClient
import sys
import requests
from bs4 import BeautifulSoup
import time
import gc
from urllib.parse import quote
from email.utils import parsedate_to_datetime
from scripts.db import client
from googlenewsdecoder import gnewsdecoder
from dotenv import load_dotenv

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
INPUT_FILE = os.path.join(DATA_DIR, 'stocks_input.json')
OUTPUT_FILE = os.path.join(DATA_DIR, 'news_content.json')
PROCESSED_URLS_FILE = os.path.join(DATA_DIR, 'processed_urls.json')
URL_CONTENT_FILE = os.path.join(DATA_DIR, 'url_content.json')
BATCH_SIZE = 50  # Number of URLs to cache before saving


# Load environment variables from app/.env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# Headers for web scraping
HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) '
        'Chrome/91.0.4472.124 Safari/537.36'
    )
}

def get_final_url(base_url):
    try:
        decoded_url = gnewsdecoder(base_url)
        if decoded_url.get("status"):
            return decoded_url["decoded_url"]
        else:
            return base_url
    except Exception as e:
        print(f"Error decoding URL: {e}")
        return None

def custom_fetch_latest_headlines(search_text, num_headlines):
    # Fetch headlines from Google News RSS feed
    print("Fetching headlines from Google News RSS feed...")
    
    # URL encode the search text to handle spaces and special characters
    encoded_search = quote(search_text)
    base_url = "https://news.google.com/news/rss/search/section/q"
    url = f"{base_url}/{encoded_search}/?hl=en-IN&gl=IN&ned=in"
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        # Use basic HTML parser instead of XML parser
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Get all items which contain both title and pubDate
        items = soup.find_all('item')
        
        # Get current time in UTC
        current_time = datetime.now(timezone.utc)
        
        # Calculate start of yesterday in UTC
        today = current_time.replace(hour=0, minute=0, second=0, microsecond=0)
        start_of_yesterday = today - timedelta(days=2)
        
        # print(f"Fetching articles from {start_of_yesterday} to {current_time}")
        
        filtered_headlines = []
        for item in items:
            title_tag = item.find('title')
            link_tag = item.find('link')
            pubdate_tag = item.find('pubdate')
            
            if title_tag and link_tag and pubdate_tag:
                # Get the URL which is the text content after the link tag
                url = link_tag.next_sibling.strip()
                # Parse the publication date (already timezone-aware)
                pub_date = parsedate_to_datetime(pubdate_tag.text.strip())
                
                # Include articles from start of yesterday until now
                if (title_tag.text.strip() and url and 
                    pub_date >= start_of_yesterday and 
                    pub_date <= current_time):
                    filtered_headlines.append({
                        'title': title_tag.text.strip(),
                        'url': get_final_url(url),
                        'published_at': pub_date.isoformat(),
                        'fetched_at': current_time.isoformat(),
                        'search_term': search_text
                    })
        
        # Sort headlines by published date, newest first
        filtered_headlines.sort(key=lambda x: x['published_at'], reverse=True)
        
        # print("Found", len(filtered_headlines), "custom headlines")
        return filtered_headlines[:num_headlines]
        
    except Exception as e:
        print(f"    ❌ Error fetching news for '{search_text}': {str(e)}")
        return []


def load_processed_urls():
    """Load the set of already processed URLs and their content"""
    try:
        with open(PROCESSED_URLS_FILE, 'r') as f:
            processed_urls = set(json.load(f))
    except (FileNotFoundError, json.JSONDecodeError):
        processed_urls = set()
        
    try:
        with open(URL_CONTENT_FILE, 'r') as f:
            url_content = json.load(f)
            # Limit cached content to most recent 1000 URLs
            if len(url_content) > 1000:
                url_content = dict(list(url_content.items())[-1000:])
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
        
        # Clear memory
        del soup, response
        gc.collect()
        
        if not article_content:
            return "Failed to extract article content"
            
        # Truncate very long content to save memory
        if len(article_content) > 20000:
            article_content = article_content[:20000]
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

 
def fetch_news_for_stock(
    stock_info, config, newsapi, processed_urls, url_content
):
    """Fetch news articles for a single stock"""
    print(f"📰 Fetching news for {stock_info['company_name']}...")
    
    # Calculate date range
    today = datetime.now()
    from_date = (
        today - timedelta(days=config['news_days_back'] + 1)
    ).strftime('%Y-%m-%d')
    to_date = today.strftime('%Y-%m-%d')
    
    # print(f"  📅 Fetching news from {from_date} to {to_date}")
    
    all_articles = []
    new_processed_urls = set()
    url_updates = {}
    articles_count = 0  # Keep track of count separately
    
    # Search for each term
    for search_term in stock_info['search_terms']:
        try:
            # print(f"  🔍 Searching for: {search_term}")
            response = newsapi.get_everything(
                q=search_term,
                language=config['language'],
                sort_by='relevancy',
                from_param=from_date,
                to=to_date,
                page_size=config['max_articles_per_stock']
            )
            
            articles = response.get('articles', [])

            # print(f"    Found {len(articles)} articles")

            headlines = custom_fetch_latest_headlines(search_term, 5)
            articles.extend(headlines)

            print("Found", len(articles), "articles")

            # Add metadata and fetch full content for each article
            for article in articles:
                url = article.get('url')
                # Skip if URL is missing or not a valid http(s) URL
                if not url or not isinstance(url, str) or not url.startswith(('http://', 'https://')):
                    continue
                article['search_term'] = search_term
                article['fetched_at'] = datetime.now().isoformat()
                
                # Check if we have valid cached content
                cached_content = url_content.get(url)
                if url in processed_urls and cached_content:
                    # print(f"    📄 Using cached content for: {url}")
                    article['full_content'] = cached_content
                else:
                    # print(f"    📥 Fetching full content from: {url}")
                    content = fetch_full_article_content(url)
                    article['full_content'] = content
                    # Only cache and mark as processed if we got valid content
                    is_valid = (
                        content and not content.startswith("Error fetching content")
                    )
                    if is_valid:
                        url_updates[url] = content
                        new_processed_urls.add(url)
                
                all_articles.append(article)
                articles_count += 1
                
                # Save URL cache in batches to manage memory
                if len(url_updates) >= BATCH_SIZE:
                    url_content.update(url_updates)
                    processed_urls.update(new_processed_urls)
                    save_processed_urls(processed_urls, url_content)
                    url_updates.clear()
                    new_processed_urls.clear()
                    gc.collect()
            
        except Exception as e:
            print(f"    ❌ Error fetching news for '{search_term}': {str(e)}")
    
    # Update processed URLs with new ones
    if url_updates:
        url_content.update(url_updates)
        processed_urls.update(new_processed_urls)
        save_processed_urls(processed_urls, url_content)
    
    # Save articles to file
    try:
        # Load existing data
        try:
            with open(OUTPUT_FILE, 'r') as f:
                news_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            news_data = {
                'metadata': {
                    'generated_at': datetime.now().isoformat(),
                    'total_stocks': 0,
                    'config': config
                },
                'stocks_news': []
            }
        
        # Update or append stock news
        stock_news = {
            'stock_info': stock_info,
            'articles_count': articles_count,
            'articles': all_articles
        }
        
        for i, existing in enumerate(news_data['stocks_news']):
            if existing['stock_info']['symbol'] == stock_info['symbol']:
                news_data['stocks_news'][i] = stock_news
                break
        else:
            news_data['stocks_news'].append(stock_news)
        
        # Update metadata
        news_data['metadata']['total_stocks'] = len(news_data['stocks_news'])

        # save updated data in the database for regular stocks
        client.stockbrew_stuff.regular_stocks_news.update_one(
            {"date": datetime.now().strftime("%Y-%m-%d")},
            {"$set": {"news_data": news_data}},
            upsert=True
        )

        # Save updated data
        with open(OUTPUT_FILE, 'w') as f:
            json.dump(news_data, f, indent=2)
            
    except Exception as e:
        print(f"❌ Error saving news content: {e}")
    
    # Store count before cleanup
    final_count = articles_count
    
    # Clear memory
    del all_articles, url_updates, new_processed_urls
    gc.collect()
    
    print(f"  ✅ Total articles: {final_count}")


 
def main(api_key):
    """Main function to fetch news for all stocks"""
    print("🚀 Starting news fetching process...")
    global OUTPUT_FILE

    # Load configuration and processed URLs
    data = load_stocks_config()
    stocks = data['stocks']
    config = data['config']
    
    processed_urls, url_content = load_processed_urls()
    print(f"📋 Found {len(processed_urls)} previously processed URLs")
    
    # Initialize NewsAPI client
    try:
        newsapi = NewsApiClient(api_key=api_key)
    except Exception as e:
        print(f"❌ Failed to initialize NewsAPI client: {e}")
        sys.exit(1)

    # Process each stock
    for stock in stocks:
        fetch_news_for_stock(
            stock, config, newsapi, processed_urls, url_content
        )
        gc.collect()  # Force garbage collection between stocks
    
    print("✨ News fetching completed successfully!")


if __name__ == "__main__":
    main(api_key=os.getenv("NEWS_API_KEY_PROD")) 