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

Create `app/.env` with the following variables (see `.env.example`):

```
NEWS_API_KEY=
GEMINI_API_KEY=
BREVO_API_KEY=
BASEROW_API_TOKEN=
MONGODB_URI=
```

These are loaded automatically by scripts using `python-dotenv`.