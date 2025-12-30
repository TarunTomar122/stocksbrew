import random
import sys
from datetime import datetime
from pathlib import Path
import os
from dotenv import load_dotenv

# Add app directory to Python path before importing custom modules
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from scripts.utils import (
    get_all_entries_from_baserow,
    get_unique_stocks_from_baserow,
    prepare_stocks_input,
)
from scripts.send_emails import send_newsletter_email
from scripts.generate_summary import main as generate_summary
from scripts.generate_newsletter import (
    refine_summaries,
    generate_newsletter,
    save_newsletter,
)
from scripts.fetch_news import main as fetch_news
from scripts.fetch_stock_prices import store_stock_prices_for_summaries
from scripts.db import client
from scripts.utils import BASEROW_CONFIG

# Load environment variables from app/.env
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / '.env')

# API keys from environment
news_api_key = os.getenv("NEWS_API_KEY_PROD")
gemini_api_key = os.getenv("GEMINI_API_KEY_PROD")


def manage_regular_stocks():
    """Manage regular stocks pipeline - fetch news, generate summaries"""
    today = datetime.now().strftime("%Y-%m-%d")

    # Get unique stocks from Baserow
    print("🔍 Getting stocks from Baserow...")
    stocks = get_unique_stocks_from_baserow()

    if not stocks:
        print("❌ No stocks found in Baserow")
        return

    # Check if news for regular stocks today is in database, if not fetch
    regular_stocks_news = client.stockbrew_stuff.regular_stocks_news

    if not regular_stocks_news.find_one({"date": today}):
        print("📰 Fetching regular stocks news...")
        prepare_stocks_input(stocks)
        fetch_news(api_key=news_api_key)
    else:
        print("✅ Regular stocks news already fetched for today")

    # Check if summaries for regular stocks today is in database
    regular_summaries = client.stockbrew_stuff.regular_stocks_summaries

    if not regular_summaries.find_one({"date": today}):
        print("🤖 Generating regular stocks summaries...")
        generate_summary(api_key=gemini_api_key)
    else:
        print("✅ Regular stocks summaries already generated for today")

    # Check if refined summaries for regular stocks today is in database
    regular_refined = client.stockbrew_stuff.regular_stocks_refined_summaries
    if not regular_refined.find_one({"date": today}):
        print("✨ Refining regular stocks summaries...")
        # Load summaries from database
        summaries_doc = regular_summaries.find_one({"date": today})
        if summaries_doc:
            summaries = summaries_doc.get("summaries", {})
            refined_summaries = refine_summaries(summaries, "regular_stocks")
            # Save refined summaries to database
            regular_refined.update_one(
                {"date": today},
                {"$set": {"refined_summaries": refined_summaries}},
                upsert=True,
            )
        else:
            print("❌ No summaries found to refine")
    else:
        print("✅ Regular stocks refined summaries already generated for today")

    # Fetch stock prices for today
    print("📈 Fetching stock prices for today...")
    try:
        store_stock_prices_for_summaries(days_back=1)  # Only fetch for today
        print("✅ Stock prices fetched successfully")
    except Exception as e:
        print(f"⚠️  Warning: Failed to fetch stock prices: {e}")
        # Don't fail the whole pipeline if stock prices fail


def load_summaries_from_db(selected_stocks, email):
    """Load summaries for selected stocks from database"""
    today = datetime.now().strftime("%Y-%m-%d")
    regular_refined = client.stockbrew_stuff.regular_stocks_refined_summaries
    doc = regular_refined.find_one({"date": today})
    if doc:
        all_summaries = doc.get("refined_summaries", {})
        if email == "tomartarun2001@gmail.com":
            return all_summaries
        # Filter summaries to only include selected stocks
        selected_summaries = {}
        for stock in selected_stocks:
            if stock in all_summaries:
                selected_summaries[stock] = all_summaries[stock]
        return selected_summaries
    return {}


def main():
    try:
        print("🚀 Starting newsletter pipeline...")

        # Step 1: Manage regular stocks pipeline
        print("\n📊 Managing regular stocks...")
        manage_regular_stocks()

        # Step 2: Generate and send newsletters
        print("\n📧 Generating and sending newsletters...")

        # Get all entries from Baserow
        entries = get_all_entries_from_baserow()

        for entry in entries["results"]:  # Baserow uses "results" instead of "records"
            email_field = BASEROW_CONFIG['fields']['email']
            stocks_field = BASEROW_CONFIG['fields']['selectedStocks']
            
            email = entry.get(email_field, "")
            stocks = entry.get(stocks_field, "")

            if email and stocks:
                selected_stocks = stocks.split(", ")
                summaries = load_summaries_from_db(selected_stocks, email)

                if len(summaries) > 0:  # Only send if we have summaries
                    newsletter_html = generate_newsletter(
                        summaries
                    )
                    save_newsletter(newsletter_html, email)
                    send_newsletter_email(newsletter_html, email)
                    print(f"✅ Newsletter sent to {email}")
                else:
                    print(f"❌ No summaries found for {email}")

        print("✅ Newsletter pipeline completed!")
        return True
    except Exception as e:
        print(f"❌ Error in newsletter pipeline: {e}")
        raise e


if __name__ == "__main__":
    main()
