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
from urllib.parse import quote, urlparse, parse_qs, unquote
from bs4 import BeautifulSoup
import contextlib

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

def search_and_get_link(query):
    # Use DuckDuckGo HTML interface
    url = f"https://html.duckduckgo.com/html/?q={quote(query)}"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, 'html.parser')
    links = soup.find_all('a', href=True)

    print(f"Found {len(links)} links in search_and_get_link", soup)

    for link in links:
        href = link['href']
        if href.startswith("/l/?uddg="):
            # DuckDuckGo's redirect wrapper, extract real link
            parsed = urlparse(href)
            query_params = parse_qs(parsed.query)
            real_url = unquote(query_params.get("uddg", [""])[0])
        else:
            real_url = href

        if real_url:
            return real_url

    return None


@contextlib.contextmanager
def initialize():
    """Initialize the browser and page"""
    print("Initializing custom fetch")
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
            yield browser, page
    except Exception as e:
        print(f"Error initializing custom fetch initialize: {e}")
        return

def do_work_on_page(page, query):
    try:
        print(f"Searching for link for query do_work_on_page: {query}")
        page.goto(f"https://html.duckduckgo.com/html/?q={query.replace(' ', '+')}", wait_until="networkidle")
        # page.wait_for_selector("a")  # Wait for any link to show

        links = page.query_selector_all("a")
        print(f"Found {len(links)} links in do_work_on_page", links)
        for link in links:
            href = link.get_attribute("href")
            print(f"Found link in do_work_on_page before the check: {href}")
            if href and "http" in href and "google" not in href:
                print(f"Found link in do_work_on_page after the check: {href}")
                if "/l/?uddg=" in href:
                    print(f"Found link in do_work_on_page after the final check: {href}")
                    parsed = urlparse(href)
                    query_params = parse_qs(parsed.query)
                    real_url = unquote(query_params.get("uddg", [""])[0])
                    print(f"Found link in do_work_on_page finally wuu: {real_url}")
                    if real_url.startswith("http"):
                        return real_url
                return href
        print("No link found in do_work_on_page")
        return None
    except Exception as e:
        print(f"Error searching for link in custom fetch do_work_on_page: {e}")
        return None


# def search_and_get_link(query):
#     try:
#         with initialize() as (browser, page):
#             return do_work_on_page(page, query)
#     except Exception as e:
#         print(f"Error searching for link in custom fetch search_and_get_link: {e}")
#         return None

# def search_and_get_link(query):
#     print(f"Searching for link for query search_and_get_link: {query}")
#     try:
#         with sync_playwright() as p:
#             browser, page = initialize(p)
#             return do_work_on_page(page, query)
#     except Exception as e:
#         print(f"Error searching for link in custom fetch: {e}")
#         return None


# def search_and_get_link(query):
#     try:
#         with sync_playwright() as p:
#             print(f"Searching for link for query: {query}")
#         browser = p.chromium.launch(
#             headless=True,
#             args=[
#                 '--disable-blink-features=AutomationControlled',
#                 '--disable-dev-shm-usage',
#                 '--no-sandbox',
#                 '--disable-setuid-sandbox',
#                 '--disable-accelerated-2d-canvas',
#                 '--disable-gpu'
#             ]
#         )
#         context = browser.new_context(
#             viewport={'width': 1920, 'height': 1080},
#             user_agent=HEADERS["User-Agent"],
#             extra_http_headers=HEADERS
#         )
#         page = context.new_page()
#         page.goto(f"https://www.google.com/search?q={query.replace(' ', '+')}", wait_until="networkidle")
#         page.wait_for_selector("a")  # Wait for any link to show

#         links = page.query_selector_all("a")
#         for link in links:
#             href = link.get_attribute("href")
#             if href and "http" in href and "google" not in href:
#                 return href

#         browser.close()

#     except Exception as e:
#         print(f"Error searching for link in custom fetch: {e}")
#         return None
