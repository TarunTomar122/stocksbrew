#!/usr/bin/env python3
"""
Script to fetch historical stock prices and store in database
Uses Yahoo Finance (yfinance) for real stock price data
"""

import os
import sys
from datetime import datetime, timedelta
from dotenv import load_dotenv
from scripts.db import client
import yfinance as yf
import time

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))


# Comprehensive stock symbol mappings
STOCK_SYMBOL_MAP = {
    # Indian Stocks (NSE)
    'Reliance Industries Limited': 'RELIANCE.NS',
    'Reliance Industries Ltd.': 'RELIANCE.NS',
    'Reliance Industries Ltd': 'RELIANCE.NS',
    'Tata Consultancy Services Limited': 'TCS.NS',
    'HDFC Bank Limited': 'HDFCBANK.NS',
    'HDFC Asset Management Company Limited': 'HDFCAMC.NS',
    'Infosys Limited': 'INFY.NS',
    'Hindustan Unilever Limited': 'HINDUNILVR.NS',
    'ICICI Bank Limited': 'ICICIBANK.NS',
    'State Bank of India': 'SBIN.NS',
    'Bharti Airtel Limited': 'BHARTIARTL.NS',
    'Kotak Mahindra Bank Limited': 'KOTAKBANK.NS',
    'ITC Limited': 'ITC.NS',
    'Larsen & Toubro Limited': 'LT.NS',
    'L&T Finance Limited': 'L&TFH.NS',
    'Asian Paints Limited': 'ASIANPAINT.NS',
    'Axis Bank Limited': 'AXISBANK.NS',
    'Bajaj Finance Limited': 'BAJFINANCE.NS',
    'Maruti Suzuki India Limited': 'MARUTI.NS',
    'Titan Company Limited': 'TITAN.NS',
    'Wipro Limited': 'WIPRO.NS',
    'Nestle India Limited': 'NESTLEIND.NS',
    'HCL Technologies Limited': 'HCLTECH.NS',
    'Tech Mahindra Limited': 'TECHM.NS',
    'UltraTech Cement Limited': 'ULTRACEMCO.NS',
    'Sun Pharmaceutical Industries Limited': 'SUNPHARMA.NS',
    'Power Grid Corporation of India Limited': 'POWERGRID.NS',
    'Mahindra & Mahindra Limited': 'M&M.NS',
    'Tata Steel Limited': 'TATASTEEL.NS',
    'Tata Motors Limited': 'TATAMOTORS.NS',
    'Bajaj Auto Limited': 'BAJAJ-AUTO.NS',
    'Adani Ports and Special Economic Zone Limited': 'ADANIPORTS.NS',
    'Adani Enterprises Limited': 'ADANIENT.NS',
    'Dr. Reddy\'s Laboratories Limited': 'DRREDDY.NS',
    "Dr. Reddy's Laboratories Limited": 'DRREDDY.NS',
    'ADF Foods Ltd': 'ADFFOODS.NS',
    'Rail Vikas Nigam Limited': 'RVNL.NS',
    'Tata Power Company Limited': 'TATAPOWER.NS',
    'Hindustan Unilever Ltd.': 'HINDUNILVR.NS',
    'Tata Motors Limited': 'TATAMOTORS.NS',
    'Hindustan Aeronautics Limited': 'HAL.NS',
    'Hero MotoCorp Limited': 'HEROMOTOCO.NS',
    'Zen Technologies Limited': 'ZENTEC.NS',
    'HDFC Bank Ltd.': 'HDFCBANK.NS',
    'HDFC Bank Ltd': 'HDFCBANK.NS',
    'Sun Pharmaceutical Industries Ltd.': 'SUNPHARMA.NS',
    'Sun Pharmaceutical Industries Ltd': 'SUNPHARMA.NS',
    'Vedanta Limited': 'VEDL.NS',
    'Indian Energy Exchange Limited': 'IEX.NS',
    'The Indian Hotels Company Limited': 'INDHOTEL.NS',
    'Wockhardt Limited': 'WOCKPHARMA.NS',
    'ETERNAL LIMITED': 'ETERNAL.NS',
    
    # Ticker symbols (Indian stocks)
    'RELIANCE': 'RELIANCE.NS',
    'TATAPOWER': 'TATAPOWER.NS',
    'TATAMOTORS': 'TATAMOTORS.NS',
    'WIPRO': 'WIPRO.NS',
    'TCS': 'TCS.NS',
    'INFY': 'INFY.NS',
    'HDFCBANK': 'HDFCBANK.NS',
    'ICICIBANK': 'ICICIBANK.NS',
    'VOLTAS': 'VOLTAS.NS',
    'MARUTI': 'MARUTI.NS',
    'TRENT': 'TRENT.NS',
    'ADANIGREEN': 'ADANIGREEN.NS',
    'ADANIPORTS': 'ADANIPORTS.NS',
    'BHEL': 'BHEL.NS',
    'ETERNAL': 'ETERNAL.NS',
    
    # US Stocks - Company Names
    'Apple Inc.': 'AAPL',
    'Microsoft Corporation': 'MSFT',
    'Amazon.com Inc.': 'AMZN',
    'Alphabet Inc. (Class A)': 'GOOGL',
    'Alphabet': 'GOOGL',
    'Tesla, Inc.': 'TSLA',
    'Meta Platforms Inc.': 'META',
    'Meta': 'META',
    'NVIDIA Corporation': 'NVDA',
    'Netflix Inc.': 'NFLX',
    'Adobe Inc.': 'ADBE',
    'PayPal Holdings Inc.': 'PYPL',
    'Intel Corporation': 'INTC',
    'Cisco Systems, Inc.': 'CSCO',
    'Oracle Corporation': 'ORCL',
    'Salesforce Inc.': 'CRM',
    'Amazon': 'AMZN',
    'Google': 'GOOGL',
    'Facebook': 'META',
    'Apple': 'AAPL',
    'Microsoft': 'MSFT',
    'Tesla': 'TSLA',
    'Nvidia': 'NVDA',
    
    # US Stock Tickers (prevent adding .NS)
    'AAPL': 'AAPL',
    'MSFT': 'MSFT',
    'GOOGL': 'GOOGL',
    'GOOG': 'GOOG',
    'AMZN': 'AMZN',
    'NVDA': 'NVDA',
    'META': 'META',
    'TSLA': 'TSLA',
    'NFLX': 'NFLX',
    'ADBE': 'ADBE',
    'PYPL': 'PYPL',
    'INTC': 'INTC',
    'AMD': 'AMD',
    'ORCL': 'ORCL',
    'CRM': 'CRM',
    'V': 'V',
    'MA': 'MA',
    'JPM': 'JPM',
    'BAC': 'BAC',
    'WFC': 'WFC',
}

# Known US ticker list for validation
US_TICKERS = {
    'AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'NVDA', 'META', 'TSLA', 
    'NFLX', 'ADBE', 'PYPL', 'INTC', 'AMD', 'ORCL', 'CRM', 'V', 'MA',
    'JPM', 'BAC', 'WFC', 'GS', 'MS', 'C', 'COIN', 'SQ', 'SHOP'
}


def get_stock_symbol(company_name):
    """
    Convert company name to stock symbol (ticker)
    Returns symbol with appropriate suffix (.NS for NSE, none for US)
    """
    # Direct match
    if company_name in STOCK_SYMBOL_MAP:
        return STOCK_SYMBOL_MAP[company_name]
    
    # Try fuzzy matching (remove common suffixes)
    simplified_name = company_name.replace(' Limited', '').replace(' Ltd.', '').replace(' Ltd', '').replace(' Inc.', '').replace(' Inc', '').strip()
    if simplified_name in STOCK_SYMBOL_MAP:
        return STOCK_SYMBOL_MAP[simplified_name]
    
    # If it's already a ticker symbol and short
    if len(company_name) <= 15 and company_name.isupper():
        # Check if it's a known US ticker (don't add .NS)
        if company_name in US_TICKERS:
            return company_name
        
        # For unknown tickers, assume Indian and add .NS
        # But first check if it already has .NS
        if not company_name.endswith('.NS') and not company_name.endswith('.BO'):
            return f"{company_name}.NS"
        return company_name
    
    return None


def fetch_stock_price_yfinance(symbol, date):
    """
    Fetch stock price for a specific date using yfinance
    Returns the closing price
    """
    try:
        # Parse date
        target_date = datetime.strptime(date, '%Y-%m-%d')
        
        # Fetch data for the specific date + a few days buffer
        start_date = (target_date - timedelta(days=3)).strftime('%Y-%m-%d')
        end_date = (target_date + timedelta(days=3)).strftime('%Y-%m-%d')
        
        # Download stock data
        stock = yf.Ticker(symbol)
        hist = stock.history(start=start_date, end=end_date)
        
        if hist.empty:
            return None
        
        # Try to get the exact date
        hist.index = hist.index.tz_localize(None)  # Remove timezone
        
        # Try exact date first
        if target_date.strftime('%Y-%m-%d') in hist.index.strftime('%Y-%m-%d').values:
            price = hist.loc[hist.index.strftime('%Y-%m-%d') == target_date.strftime('%Y-%m-%d'), 'Close'].iloc[0]
            return float(price)
        
        # If exact date not found, get closest date
        hist['date_diff'] = abs((hist.index - target_date).days)
        closest_row = hist.loc[hist['date_diff'].idxmin()]
        return float(closest_row['Close'])
        
    except Exception as e:
        print(f"  ⚠️  Error fetching price for {symbol}: {e}")
        return None


def store_stock_prices_for_summaries(days_back=30):
    """
    Fetch and store stock prices for all dates with summaries
    """
    print(f"📈 Fetching stock prices for the last {days_back} days...")
    
    summaries_collection = client.stockbrew_stuff.regular_stocks_summaries
    
    # Calculate date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days_back)
    
    start_date_str = start_date.strftime("%Y-%m-%d")
    end_date_str = end_date.strftime("%Y-%m-%d")
    
    # Get summary documents in date range
    documents = list(summaries_collection.find({
        "date": {
            "$gte": start_date_str,
            "$lte": end_date_str
        }
    }).sort("date", 1))
    
    print(f"Found {len(documents)} days with summaries\n")
    
    total_updated = 0
    
    for doc in documents:
        date = doc.get('date')
        summaries = doc.get('summaries', {})
        
        if not summaries:
            continue
        
        print(f"📅 Processing {date}...")
        updated_summaries = {}
        doc_updated = False
        
        for company_name, summary in summaries.items():
            # Skip if already has price
            if 'stock_price' in summary and summary['stock_price'] is not None:
                print(f"  ✓ {company_name} - already has price")
                updated_summaries[company_name] = summary
                continue
            
            # Get stock symbol
            symbol = get_stock_symbol(company_name)
            
            if not symbol:
                print(f"  ⚠️  {company_name} - symbol not found")
                updated_summaries[company_name] = summary
                continue
            
            # Fetch price
            print(f"  📊 Fetching {company_name} ({symbol})...", end=' ')
            price = fetch_stock_price_yfinance(symbol, date)
            
            if price:
                summary['stock_price'] = price
                summary['stock_symbol'] = symbol
                # Show correct currency symbol
                currency = '₹' if symbol.endswith('.NS') or symbol.endswith('.BO') else '$'
                print(f"{currency}{price:.2f} ✅")
                doc_updated = True
            else:
                print("❌")
            
            updated_summaries[company_name] = summary
            
            # Rate limiting to avoid API throttling
            time.sleep(0.5)
        
        # Update document in database if any prices were added
        if doc_updated:
            summaries_collection.update_one(
                {"_id": doc['_id']},
                {"$set": {"summaries": updated_summaries}}
            )
            total_updated += 1
            print(f"  ✅ Updated database for {date}\n")
        else:
            print(f"  ⏭️  No updates needed for {date}\n")
    
    print(f"\n✨ Stock price fetching complete! Updated {total_updated} days")


def main():
    """Main function"""
    print("🚀 Starting stock price fetching...\n")
    
    try:
        # Fetch prices for last 15 days
        store_stock_prices_for_summaries(days_back=15)
        
        print("\n✅ All done! Stock prices have been added to your summaries.")
        print("💡 Tip: Run this script daily to keep prices updated")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()

