import random
import sys
from datetime import datetime
from pathlib import Path

# Add app directory to Python path before importing custom modules
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import gc
import time
import random
from playwright.sync_api import sync_playwright
import requests
from urllib.parse import quote
from bs4 import BeautifulSoup
# from scripts.fetch_news import custom_fetch_latest_headlines, fetch_full_article_content

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "DNT": "1"
}


def fetch_full_article_content_custom(url):
    """Fetch and extract the full content of an article from its URL"""
    try:
        
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                args=[
                    '--disable-blink-features=AutomationControlled',
                    '--disable-dev-shm-usage',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu'
                ]
            )
            context = browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent=HEADERS["User-Agent"],
                extra_http_headers=HEADERS
            )
            
            page = context.new_page()
            
            # Add random delay to mimic human behavior
            # time.sleep(random.uniform(1, 3))
            
            # Navigate with a timeout
            try:
                page.goto(url, wait_until="networkidle", timeout=10000)
                time.sleep(random.uniform(3, 6))  # Wait for dynamic content
            except Exception as e:
                print(f"Navigation error: {e}")
                return f"Navigation error: {str(e)}"

            article_content = page.content()

            soup = BeautifulSoup(article_content, "html.parser")

            # Remove unwanted elements
            unwanted = ["script", "style", "nav", "header", "footer", "iframe", "aside", "a", "img", "svg", "link", "meta"]
            for element in soup.find_all(unwanted):
                element.decompose()

            # Try different methods to find the main content
            article_content = None

            # Method 1: Look for article tag
            if article_content is None:
                article = soup.find("article")
                if article:
                    article_content = article.get_text(separator=" ", strip=True)

            # Method 2: Look for common content div classes/ids
            if article_content is None:
                content_selectors = [
                    # Common article content selectors
                    '[class*="article"]',
                    '[class*="content"]', 
                    '[class*="story"]',
                    '[class*="body"]',
                    '[class*="text"]',
                    '[class*="post"]',
                    '[id*="article"]',
                    '[id*="content"]',
                    '[id*="story"]',
                    # Specific news site selectors
                    '.entry-content',
                    '.post-content',
                    '.article-body',
                    '.story-body',
                    '.content-body'
                ]
                
                for selector in content_selectors:
                    elements = soup.select(selector)
                    if elements:
                        # Get the element with the most text
                        longest = max(elements, key=lambda x: len(x.get_text()))
                        content = longest.get_text(separator=" ", strip=True)
                        if len(content) > 200:  # Only use if substantial content
                            article_content = content
                            break

            # Method 3: Look for paragraphs in main content areas
            if article_content is None:
                main_areas = soup.find_all(['main', 'div'], 
                                        class_=lambda x: x and 
                                        any(term in str(x).lower() 
                                            for term in ['main', 'primary', 'content']))
                if main_areas:
                    for area in main_areas:
                        paragraphs = area.find_all("p")
                        if len(paragraphs) >= 3:  # At least 3 paragraphs
                            content = " ".join(p.get_text().strip() for p in paragraphs)
                            if len(content) > 200:
                                article_content = content
                                break

            # Method 4: Get all paragraphs as fallback
            if article_content is None:
                paragraphs = soup.find_all("p")
                if paragraphs:
                    article_content = " ".join(p.get_text().strip() for p in paragraphs)

            # Method 5: Last resort - clean up and get all text
            if not article_content or len(article_content) < 100:
                # Remove more unwanted elements
                unwanted_final = [
                    "svg", "img", "script", "style", "nav", "header", 
                    "footer", "aside", "form", "button"
                ]
                for element in soup.find_all(unwanted_final):
                    element.decompose()

                article_content = soup.get_text(separator=" ", strip=True)

            print("length of article content: ", len(article_content))

            # Clear memory
            del soup, page, browser
            gc.collect()

            if not article_content or len(article_content) < 50:
                return "Failed to extract meaningful article content"

            # Clean up the content
            lines = article_content.split('\n')
            cleaned_lines = []
            for line in lines:
                line = line.strip()
                if len(line) > 10:  # Only keep substantial lines
                    cleaned_lines.append(line)
            
            article_content = ' '.join(cleaned_lines)

            # Truncate very long content to save memory
            if len(article_content) > 20000:
                article_content = article_content[:20000] + "... [truncated]"
                
            return article_content

    except requests.exceptions.RequestException as e:
        err_msg = f"    ⚠️ Network error fetching {url}: {str(e)}"
        print(err_msg)
        return f"Network error: {str(e)}"
    except Exception as e:
        err_msg = f"    ⚠️ Error fetching full content from {url}: {str(e)}"
        print(err_msg)
        return f"Error fetching content: {str(e)}"


stock_list = ["HDFC Bank Limited", "Indian Energy Exchange Limited", "IDFC First Bank Limited"]


def search_and_get_link(query):
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu'
            ]
        )
        context = browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent=HEADERS["User-Agent"],
            extra_http_headers=HEADERS
        )
        page = context.new_page()
        page.goto(f"https://www.google.com/search?q={query.replace(' ', '+')}", wait_until="networkidle")
        page.wait_for_selector("a")  # Wait for any link to show

        links = page.query_selector_all("a")
        for link in links:
            href = link.get_attribute("href")
            if href and "http" in href and "google" not in href:
                return href

        browser.close()

# for stock in stock_list:
#     print(stock)
#     print(search_and_get_link(stock + " stock news today"))
#     break