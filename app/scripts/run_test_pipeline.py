from pathlib import Path
import sys
import random
# Add app directory to Python path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# All imports after path setup
from scripts.fetch_news import main as fetch_news
from scripts.generate_newsletter import (
    load_summaries,
    refine_summaries,
    generate_newsletter,
    save_newsletter,
    load_hot_stocks_summaries,
    load_hot_stocks_refined_summaries
)
from scripts.generate_summary import main as generate_summary
from scripts.send_emails import send_newsletter_email
from server import (
    get_unique_stocks_from_airtable,
    get_all_entries_from_airtable,
    prepare_stocks_input
)

def get_hot_stocks():
    # fetch_news(api_key="ad3828da77694151a23be433536ad81f", hot_stocks=True)
    # summaries = generate_summary(api_key="AIzaSyAyycEffMJ-NaBNgp4hYKulRFcKvH9vNIo", hot_stocks=True)
    # refined_summaries = refine_summaries(summaries, 'hot_stocks')
    refined_summaries = load_hot_stocks_refined_summaries()
    return refined_summaries.get('HOT STOCK', [])

def main():
    try:
        print('🔍 Getting stocks from Airtable...')
        stocks = get_unique_stocks_from_airtable()
        prepare_stocks_input(stocks)
        
        print('📰 Fetching news...')
        # fetch_news(api_key="ad3828da77694151a23be433536ad81f")
        
        print('🤖 Generating summaries...')
        # generate_summary(api_key="AIzaSyAyycEffMJ-NaBNgp4hYKulRFcKvH9vNIo")

        print('🔥 Getting hot stocks...')
        hot_stocks = get_hot_stocks()
        # get 3 random stocks from the refined summaries
        random_hot_stocks = random.sample(hot_stocks, 3)

        print('📧 Generating and sending newsletters...')
        my_email = "tomartarun2001@gmail.com"
        entries = get_all_entries_from_airtable()

        for entry in entries['records']:
            email = entry.get('fields', {}).get('Email', '')
            stocks = entry.get('fields', {}).get('Selected Stocks', '')
        
            if email and stocks and email == my_email:
                selected_stocks = stocks.split(', ')
                print(selected_stocks)
                summaries = load_summaries(selected_stocks)
                refined_summaries = refine_summaries(summaries)

                if refined_summaries:
                    newsletter_html = generate_newsletter(refined_summaries, random_hot_stocks)
                    save_newsletter(newsletter_html, email)
                    send_newsletter_email(newsletter_html, email)
        
        print('✅ Newsletter pipeline completed!')
        return True
    except Exception as e:
        print(f'❌ Error in newsletter pipeline: {e}')
        raise e


if __name__ == '__main__':
    main() 