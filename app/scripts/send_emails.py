#!/usr/bin/env python3
"""
Script 4: Send Email Newsletter
Reads the generated HTML newsletter and sends it via Brevo API
"""

import os
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from datetime import datetime

# Configuration
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'output')
NEWSLETTER_FILE = os.path.join(OUTPUT_DIR, 'newsletter_tomartarun2001@gmail.com_20250524.html')

# Brevo API configuration
API_KEY = ("xkeysib-83b049564bb7033c049c81ba992d379886f50fc74d90bae51667ce6c"
           "44942bf0-TZFQ8HIXcowe3i7F")
EMAIL_FROM = {
    "email": "tomartarun2001@gmail.com",
    "name": "StocksBrew Newsletter"
}
EMAIL_TO = [{"email": "tomar.4@iitj.ac.in"}]


def load_newsletter():
    """Load the generated newsletter HTML"""
    try:
        with open(NEWSLETTER_FILE, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"❌ Newsletter file not found: {NEWSLETTER_FILE}")
        print("   Please run script 3 (generate_newsletter.py) first")
        return None


def send_newsletter_email(html_content, email):
    """Send the newsletter via Brevo API"""
    print("\n📧 Starting email process...")
    print(f"From: {EMAIL_FROM['email']}")
    print(f"To: {email}")
    
    try:
        # Configure API key
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = API_KEY

        # Create an instance of the API class
        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
            sib_api_v3_sdk.ApiClient(configuration)
        )
        
        # Create email subject with current date
        current_date = datetime.now().strftime("%B %d, %Y")
        subject = f"☕ StocksBrew Daily - {current_date}"
        
        # Create email object with HTML content - using the HTML as-is
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": email}],
            sender=EMAIL_FROM,
            subject=subject,
            html_content=html_content,
            text_content=(
                "Please view this email in an HTML-capable email client."
            )
        )
        
        print("📤 Sending email via Brevo API...")
        api_response = api_instance.send_transac_email(send_smtp_email)
        print("✅ Email sent successfully!")
        print(f"📧 Message ID: {api_response.message_id}")
        return True
        
    except ApiException as e:
        print("❌ API error occurred!")
        print(f"Error code: {e.reason}")
        print(f"Error details: {e.body}")
        return False
    except Exception as e:
        print("❌ An unexpected error occurred!")
        print(f"Error type: {type(e).__name__}")
        print(f"Error details: {str(e)}")
        return False



def main():
    """Main function to send newsletter email"""
    print("📧 Starting email sending process...")
    
    # Load newsletter
    html_content = load_newsletter()
    if not html_content:
        return
    
    print(f"📄 Newsletter loaded ({len(html_content)} characters)")
    
    # Show email configuration
    print("\n📋 Email Configuration:")
    print(f"   From: {EMAIL_FROM['email']} ({EMAIL_FROM['name']})")
    print(f"   To: {EMAIL_TO[0]['email']}")
    print("   Service: Brevo API")
    
    # Send email
    success = send_newsletter_email(html_content, EMAIL_TO[0]['email'])
    
    if success:
        print("\n🎉 Newsletter delivery complete!")
        print("📱 Check your email inbox for the newsletter.")
    else:
        print("\n❌ Newsletter delivery failed.")
        print("💡 Tips:")
        print("   - Check your Brevo API key")
        print("   - Verify email addresses are valid")
        print("   - Check Brevo account status and limits")


if __name__ == "__main__":
    main() 