import requests
import json
import os

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
            "max_articles_per_stock": 1
        },
        "stocks": [
            {
                "symbol": stock,
                "company_name": stock,  # We can enhance this with company names
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
