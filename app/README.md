# StocksBrew Server

This is the backend server for StocksBrew that handles email subscriptions and sends welcome emails.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python server.py
```

The server will start on http://localhost:5000

## API Endpoints

### POST /subscribe
Subscribe a user and send a welcome email.

**Request Body:**
```json
{
    "email": "user@example.com"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Welcome email sent successfully"
}
```

## Environment Variables

The server uses Brevo (formerly Sendinblue) for sending emails. The API key is currently hardcoded but should be moved to a .env file in production. 