#!/usr/bin/env python3
"""
Quick test script to verify botasaurus-requests is working correctly
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from scripts.fetch_news import fetch_full_article_content

# Test URLs - real working news sites
test_urls = [
    "https://www.bbc.com/news/business",
    "https://techcrunch.com/",
    "https://www.reuters.com/technology/",
]

print("🧪 Testing Botasaurus-Requests Integration\n")
print("=" * 60)

for i, url in enumerate(test_urls, 1):
    print(f"\n📰 Test {i}: {url}")
    print("-" * 60)
    
    try:
        content = fetch_full_article_content(url)
        
        if content.startswith("Error"):
            print(f"❌ Failed: {content}")
        else:
            # Show first 200 chars of content
            preview = content[:200] + "..." if len(content) > 200 else content
            print(f"✅ Success! Retrieved {len(content)} characters")
            print(f"📄 Preview: {preview}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

print("\n" + "=" * 60)
print("✨ Test complete!")

