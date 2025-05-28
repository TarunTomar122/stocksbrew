import random
import sys
from datetime import datetime
from pathlib import Path

# Add app directory to Python path before importing custom modules
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from scripts.utils import (
    get_all_entries_from_airtable,
    get_unique_stocks_from_airtable,
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
from scripts.db import client

# TEST KEYS
# news_api_key = "ad3828da77694151a23be433536ad81f"
# gemini_api_key = "AIzaSyAyycEffMJ-NaBNgp4hYKulRFcKvH9vNIo"

# PROD KEYS
news_api_key = "ffa35669f5154e2cb785128081374d52"
gemini_api_key = "AIzaSyABCLvv9bHzvK4K6wt9S1PPrI3_O5mXq0o"


def manage_hot_stocks():
    """Manage hot stocks pipeline - fetch news, generate summaries, refine"""
    today = datetime.now().strftime("%Y-%m-%d")

    # Check if news for hot stocks today is in the database, if not fetch
    if not client.stockbrew_stuff.hot_stocks_news.find_one({"date": today}):
        print("📰 Fetching hot stocks news...")
        fetch_news(api_key=news_api_key, hot_stocks=True)
    else:
        print("✅ Hot stocks news already fetched for today")

    # Check if summary for hot stocks today is in the database, if not generate
    hot_stocks_summaries = client.stockbrew_stuff.hot_stocks_summaries
    if not hot_stocks_summaries.find_one({"date": today}):
        print("🤖 Generating hot stocks summaries...")
        generate_summary(api_key=gemini_api_key, hot_stocks=True)
    else:
        print("✅ Hot stocks summaries already generated for today")

    # Check if refined summary for hot stocks today is in database
    hot_stocks_refined = client.stockbrew_stuff.hot_stocks_refined_summaries
    if not hot_stocks_refined.find_one({"date": today}):
        print("✨ Refining hot stocks summaries...")
        # Load summaries from database
        summaries_doc = client.stockbrew_stuff.hot_stocks_summaries.find_one(
            {"date": today}
        )
        if summaries_doc:
            summaries = summaries_doc.get("summaries", {})
            refined_summaries = refine_summaries(summaries, "hot_stocks")
            # Save refined summaries to database
            hot_stocks_refined.update_one(
                {"date": today},
                {"$set": {"refined_summaries": refined_summaries}},
                upsert=True,
            )
        else:
            print("❌ No summaries found to refine")
    else:
        print("✅ Hot stocks refined summaries already generated for today")


def manage_regular_stocks():
    """Manage regular stocks pipeline - fetch news, generate summaries"""
    today = datetime.now().strftime("%Y-%m-%d")

    # Get unique stocks from Airtable
    print("🔍 Getting stocks from Airtable...")
    stocks = get_unique_stocks_from_airtable()

    if not stocks:
        print("❌ No stocks found in Airtable")
        return

    # Check if news for regular stocks today is in database, if not fetch
    regular_stocks_news = client.stockbrew_stuff.regular_stocks_news
    if not regular_stocks_news.find_one({"date": today}):
        print("📰 Fetching regular stocks news...")
        prepare_stocks_input(stocks)
        fetch_news(api_key=news_api_key, hot_stocks=False)
    else:
        print("✅ Regular stocks news already fetched for today")

    # Check if summaries for regular stocks today is in database
    regular_summaries = client.stockbrew_stuff.regular_stocks_summaries
    if not regular_summaries.find_one({"date": today}):
        print("🤖 Generating regular stocks summaries...")
        generate_summary(api_key=gemini_api_key, hot_stocks=False)
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


def get_hot_stocks_from_db():
    """Get refined hot stocks from database"""
    today = datetime.now().strftime("%Y-%m-%d")
    hot_stocks_refined = client.stockbrew_stuff.hot_stocks_refined_summaries
    doc = hot_stocks_refined.find_one({"date": today})
    if doc:
        refined_summaries = doc.get("refined_summaries", {})
        return refined_summaries.get("HOT STOCK", [])
    return []


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

        # Step 1: Manage hot stocks pipeline
        print("\n🔥 Managing hot stocks...")
        manage_hot_stocks()

        # Step 2: Manage regular stocks pipeline
        print("\n📊 Managing regular stocks...")
        manage_regular_stocks()

        # Step 3: Generate and send newsletters
        print("\n📧 Generating and sending newsletters...")

        # Get hot stocks for newsletters
        hot_stocks = get_hot_stocks_from_db()
        random_hot_stocks = (
            random.sample(hot_stocks, min(len(hot_stocks), 3))
            if hot_stocks else []
        )

        # Get all entries from Airtable
        entries = get_all_entries_from_airtable()

        for entry in entries["records"]:
            email = entry.get("fields", {}).get("Email", "")
            stocks = entry.get("fields", {}).get("Selected Stocks", "")

            if email and stocks:
                selected_stocks = stocks.split(", ")
                summaries = load_summaries_from_db(selected_stocks, email)

                if summaries:  # Only send if we have summaries
                    newsletter_html = generate_newsletter(
                        summaries, random_hot_stocks
                    )
                    save_newsletter(newsletter_html, email)
                    send_newsletter_email(newsletter_html, email)
                    print(f"✅ Newsletter sent to {email}")
                else:
                    print(
                        f"⚠️ No summaries found for {email}'s stocks so sending hot stocks: "
                        f"{selected_stocks}"
                    )
                    newsletter_html = generate_newsletter(
                        summaries, random_hot_stocks
                    )
                    save_newsletter(newsletter_html, email)
                    send_newsletter_email(newsletter_html, email)
                    print(f"✅ Newsletter sent to {email}")

        print("✅ Newsletter pipeline completed!")
        return True
    except Exception as e:
        print(f"❌ Error in newsletter pipeline: {e}")
        raise e


if __name__ == "__main__":
    main()
