from flask import Flask, request, jsonify
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from dotenv import load_dotenv
import json
import os
from datetime import datetime
import requests
from apscheduler.schedulers.background import BackgroundScheduler

# Import functions from scripts
from scripts.fetch_news import main as fetch_news_main
from scripts.generate_summary import main as generate_summary_main
from scripts.generate_newsletter import (
    load_summaries,
    refine_summaries,
    generate_newsletter,
    save_newsletter,
)
from scripts.send_emails import send_newsletter_email

# Load environment variables
load_dotenv()

app = Flask(__name__)

# API configurations
BREVO_API_KEY = (
    "xkeysib-83b049564bb7033c049c81ba992d379886f50fc74d90bae51667ce6c"
    "44942bf0-TZFQ8HIXcowe3i7F"
)
AIRTABLE_CONFIG = {
    'apiKey': ('patAQ44oTB9EfY3vo.accf866ae6fd479bc292faaecd3c96f857e9e2d'
               '84c69364b041b40c88efe197d'),
    'baseId': 'app3Pnv4423RRK52w',
    'tableName': 'tblptL5RJrvRLAWzg'
}
EMAIL_FROM = {
    "email": "tomartarun2001@gmail.com",
    "name": "StocksBrew Newsletter"
}

# Initialize scheduler
scheduler = BackgroundScheduler()
scheduler.start()

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
            "news_days_back": 2,
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
    
    # Ensure data directory exists
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    # Save to stocks_input.json
    input_file = os.path.join(data_dir, 'stocks_input.json')
    with open(input_file, 'w') as f:
        json.dump(stocks_data, f, indent=2)
    
    return input_file

def run_newsletter_pipeline():
    """Run the complete newsletter generation pipeline"""
    try:
        print("\n🚀 Starting newsletter generation pipeline...")
        
        # Step 1: Get unique stocks from Airtable and prepare input
        stocks = get_unique_stocks_from_airtable()
        if not stocks:
            print("❌ No stocks found in Airtable")
            return False
        print(f"✅ Found {len(stocks)} unique stocks")
        
        # Step 2: Prepare input for news fetching
        print("\n📝 Preparing stocks input file...")
        input_file = prepare_stocks_input(stocks)
        print(f"✅ Created input file: {input_file}")
        
        # Step 3: Run each step as function calls
        print("\n📰 Fetching news...")
        fetch_news_main()
        
        print("\n🤖 Generating summaries...")
        generate_summary_main()
        
        # Step 4: Generate and send newsletters for each subscriber
        entries = get_all_entries_from_airtable()
        for entry in entries['records']:
            email = entry.get('fields', {}).get('Email', '')
            stocks = entry.get('fields', {}).get('Selected Stocks', '')
            
            if email and stocks:
                print(f"\n📧 Generating newsletter for {email}")
                selected_stocks = stocks.split(', ')
                
                # Load and process summaries
                summaries = load_summaries(selected_stocks)
          
                refined_summaries = refine_summaries(summaries)
   
                # Generate and save newsletter
                newsletter_html = generate_newsletter(refined_summaries)
                save_newsletter(newsletter_html, email)
                
                print(f"\n📧 Sending newsletter to {email}")
                send_newsletter_email(newsletter_html, email)
        
        print("\n✨ Newsletter pipeline completed successfully!")
        return True
        
    except Exception as e:
        print(f"\n❌ Error in newsletter pipeline: {e}")
        return False

# Schedule the newsletter generation to run at 5 AM daily
scheduler.add_job(
    run_newsletter_pipeline,
    'cron',
    hour=5,
    minute=0,
    id='daily_newsletter'
)

@app.route('/generate-newsletters', methods=['POST'])
def generate_newsletters():
    """Manual trigger for newsletter generation"""
    try:
        success = run_newsletter_pipeline()
        if success:
            return jsonify({
                'success': True,
                'message': 'Newsletter generation completed successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Newsletter generation failed'
            }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

def send_welcome_email(to_email):
    """Send welcome email via Brevo API"""
    try:
        # Configure API key
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = BREVO_API_KEY

        # Create an instance of the API class
        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
            sib_api_v3_sdk.ApiClient(configuration)
        )
        
        # Create welcome email content
        html_content = """
        <div style="font-family: Arial, sans-serif; max-width: 600px; 
                    margin: 0 auto; padding: 20px;">
            <h1 style="color: #06b6d4;">Welcome to StocksBrew! 🚀</h1>
            <p>Thank you for subscribing to StocksBrew's AI-powered stock 
               newsletter.</p>
            <p>You'll receive your first personalized newsletter tomorrow at 6 AM, 
               packed with:</p>
            <ul>
                <li>AI-driven market insights</li>
                <li>Personalized stock analysis</li>
                <li>Key market trends</li>
            </ul>
            <p>Stay tuned for intelligent stock market insights!</p>
            <p>Best regards,<br>The StocksBrew Team</p>
        </div>
        """
        
        # Create email object
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": to_email}],
            sender=EMAIL_FROM,
            subject="🎉 Welcome to StocksBrew Newsletter!",
            html_content=html_content,
            text_content="Welcome to StocksBrew! Thank you for subscribing."
        )
        
        # Send email
        api_response = api_instance.send_transac_email(send_smtp_email)
        return True, api_response.message_id
        
    except ApiException as e:
        return False, f"API error: {e.reason}"
    except Exception as e:
        return False, f"Error: {str(e)}"

@app.route('/subscribe', methods=['POST'])
def subscribe():
    """Handle subscription requests"""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({
                'success': False,
                'message': 'Email is required'
            }), 400
            
        email = data['email']
        
        # Send welcome email
        success, message = send_welcome_email(email)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Welcome email sent successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': f'Failed to send welcome email: {message}'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500

@app.after_request
def after_request(response):
    """Add CORS headers"""
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5000) 