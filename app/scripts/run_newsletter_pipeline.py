from pathlib import Path
import sys

# Add app directory to Python path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# All imports after path setup
from scripts.fetch_news import main as fetch_news
from scripts.generate_newsletter import (
    load_summaries,
    refine_summaries,
    generate_newsletter,
    save_newsletter
)
from scripts.generate_summary import main as generate_summary
from scripts.send_emails import send_newsletter_email
from server import (
    get_all_entries_from_airtable,
    get_unique_stocks_from_airtable,
    prepare_stocks_input
)


def main():
    try:
        print('🔍 Getting stocks from Airtable...')
        stocks = get_unique_stocks_from_airtable()
        prepare_stocks_input(stocks)
        
        print('📰 Fetching news...')
        fetch_news()
        
        print('🤖 Generating summaries...')
        generate_summary()
        
        print('📧 Generating and sending newsletters...')
        entries = get_all_entries_from_airtable()
        for entry in entries['records']:
            email = entry.get('fields', {}).get('Email', '')
            stocks = entry.get('fields', {}).get('Selected Stocks', '')
            
            if email and stocks:
                selected_stocks = stocks.split(', ')
                summaries = load_summaries(selected_stocks)
                refined_summaries = refine_summaries(summaries)
                newsletter_html = generate_newsletter(refined_summaries)
                save_newsletter(newsletter_html, email)
                send_newsletter_email(newsletter_html, email)
        
        print('✅ Newsletter pipeline completed!')
        return True
    except Exception as e:
        print(f'❌ Error in newsletter pipeline: {e}')
        raise e


if __name__ == '__main__':
    main() 