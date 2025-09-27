import requests
import json
import os
from dotenv import load_dotenv


# Load environment variables from app/.env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

BASEROW_CONFIG = {
    'apiToken': os.getenv('BASEROW_API_TOKEN'),
    'baseUrl': 'https://api.baserow.io/api/database/rows/table',
    'tableId': '564618',
    'fields': {
        'email': 'field_4530982',
        'selectedStocks': 'field_4530983',
        'subscriptionDate': 'field_4530984',
        'status': 'field_4530985',
        'market': 'field_4530986'
    }
}


def get_unique_stocks_from_baserow():
    """Fetch all unique stocks from Baserow subscriptions"""
    try:
        url = f"{BASEROW_CONFIG['baseUrl']}/{BASEROW_CONFIG['tableId']}/"
        headers = {
            'Authorization': f"Token {BASEROW_CONFIG['apiToken']}",
            'Content-Type': 'application/json'
        }
        
        response = requests.get(url, headers=headers)
        
        if not response.ok:
            raise Exception(f"Failed to fetch from Baserow: {response.text}")
            
        data = response.json()
        all_stocks = set()
        
        # Extract unique stocks from all records
        for record in data.get('results', []):
            # skip if status is not active
            if record.get(BASEROW_CONFIG['fields']['status']) != 'active':
                continue

            stocks_field = BASEROW_CONFIG['fields']['selectedStocks']
            stocks = record.get(stocks_field, '').split(', ')
            all_stocks.update([s.strip() for s in stocks if s.strip()])
            
        return list(all_stocks)
    except Exception as e:
        print(f"Error fetching stocks from Baserow: {e}")
        return []


def get_all_entries_from_baserow():
    """Fetch all entries from Baserow"""
    try:
        url = f"{BASEROW_CONFIG['baseUrl']}/{BASEROW_CONFIG['tableId']}/"
        headers = {
            'Authorization': f"Token {BASEROW_CONFIG['apiToken']}",
            'Content-Type': 'application/json'
        }
        response = requests.get(url, headers=headers)
        
        if not response.ok:
            raise Exception(f"Failed to fetch from Baserow: {response.text}")
            
        return response.json()
    except Exception as e:
        print(f"Error fetching entries from Baserow: {e}")
        return []


def prepare_stocks_input(stocks):
    """Prepare the stocks input JSON for the news fetching script"""
    stocks_data = {
        "config": {
            "news_days_back": 1,
            "language": "en",
            "max_articles_per_stock": 1
        },
        "stocks": [
            {
                "symbol": stock,
                "company_name": stock,  # TODO: Add company names
                "search_terms": [
                    f"{stock.lower()} company stocks news"
                ]
            }
            for stock in stocks
        ]
    }
    
    # Ensure data directory exists - use same path as fetch_news.py expects
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    # Save to stocks_input.json
    input_file = os.path.join(data_dir, 'stocks_input.json')
    with open(input_file, 'w') as f:
        json.dump(stocks_data, f, indent=2)
    
    print(f"✅ Created stocks input file at: {input_file}")
    return input_file
