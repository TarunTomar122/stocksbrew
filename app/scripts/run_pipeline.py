# Import functions from scripts
import os
import json
import requests
from fetch_news import main as fetch_news_main
from generate_summary import main as generate_summary_main
from generate_newsletter import (
    send_newsletter_email_to_subscriber
)
from send_emails import send_newsletter_email

AIRTABLE_CONFIG = {
    'apiKey': ('patAQ44oTB9EfY3vo.accf866ae6fd479bc292faaecd3c96f857e9e2d'
               '84c69364b041b40c88efe197d'),
    'baseId': 'app3Pnv4423RRK52w',
    'tableName': 'tblptL5RJrvRLAWzg'
}

 
def get_unique_stocks_from_airtable():
    """Fetch all unique stocks from Airtable subscriptions"""
    try:
        url = (
            f"https://api.airtable.com/v0/{AIRTABLE_CONFIG['baseId']}/"
            f"{AIRTABLE_CONFIG['tableName']}"
        )
        headers = {
            'Authorization': f"Bearer {AIRTABLE_CONFIG['apiKey']}",
            'Content-Type': 'application/json'
        }
        
        response = requests.get(url, headers=headers)
        
        if not response.ok:
            raise Exception(f"Failed to fetch from Airtable: {response.text}")
            
        data = response.json()
        all_stocks = set()
        
        # Extract unique stocks from all records
        for record in data.get('records', []):
            stocks = record.get('fields', {}).get('Selected Stocks', '').split(', ')
            all_stocks.update([s.strip() for s in stocks if s.strip()])
            
        return list(all_stocks)
    except Exception as e:
        print(f"Error fetching stocks from Airtable: {e}")
        return []

 
def get_all_entries_from_airtable():
    """Fetch all entries from Airtable"""
    try:
        url = (
            f"https://api.airtable.com/v0/{AIRTABLE_CONFIG['baseId']}/"
            f"{AIRTABLE_CONFIG['tableName']}"
        )
        headers = {
            'Authorization': f"Bearer {AIRTABLE_CONFIG['apiKey']}",
            'Content-Type': 'application/json'
        }
        response = requests.get(url, headers=headers)
        return response.json()
    except Exception as e:
        print(f"Error fetching entries from Airtable: {e}")
        return []

 
def prepare_stocks_input(stocks):
    """Prepare the stocks input JSON for the news fetching script"""
    stocks_data = {
        "config": {
            "news_days_back": 1,
            "language": "en",
            "max_articles_per_stock": 2
        },
        "stocks": [
            {
                "symbol": stock,
                "company_name": stock,  # We can enhance this with company names
                "search_terms": [
                    f"{stock.lower()} company news stock"
                ]
            }
            for stock in stocks
        ]
    }
    
    # Ensure data directory exists
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    # Save to stocks_input.json
    input_file = os.path.join(data_dir, 'stocks_input.json')
    with open(input_file, 'w') as f:
        json.dump(stocks_data, f, indent=2)
    
    return True

 
def fetch_news_for_unique_stocks():
    """Fetch news for unique stocks"""
    try:
        print("\n🚀 Starting newsletter generation pipeline...")
        
        # # Step 1: Get unique stocks from Airtable and prepare input
        # stocks = get_unique_stocks_from_airtable()
        # if not stocks:
        #     print("❌ No stocks found in Airtable")
        #     return False
        # print(f"✅ Found {len(stocks)} unique stocks")
        
        # # Step 2: Prepare input for news fetching
        # print("\n📝 Preparing stocks input file...")
        # was_input_file_created = prepare_stocks_input(stocks)
        # print(f"✅ Input file created: {was_input_file_created}")

        # # Step 3: Run each step as function calls
        # print("\n📰 Fetching news...")
        # fetch_news_main()
        
        # print("\n🤖 Generating summaries...")
        # generate_summary_main()
        
        # Step 4: Generate and send newsletters for each subscriber
        entries = get_all_entries_from_airtable()
        for entry in entries['records']:
            email = entry.get('fields', {}).get('Email', '')
            stocks = entry.get('fields', {}).get('Selected Stocks', '')
            
            if email and stocks:
                print(f"\n📧 Generating newsletter for {email}")
                send_newsletter_email_to_subscriber(email, stocks)
        


    
    except Exception as e:
        print(f"❌ Error in fetch_news_for_unique_stocks: {e}")
        return False
    
    return True


if __name__ == "__main__":
    fetch_news_for_unique_stocks()