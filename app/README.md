# StocksBrew Newsletter Pipeline (`app/`)

Python automation that turns raw market news into personalized HTML newsletters and emails them to subscribers.

## Overview
- **Input**: Active subscribers and watchlists stored in Baserow (`table 564618`).
- **Processing**: Fetch articles (NewsAPI + Google News), summarize with Google Gemini, de-duplicate/refine copy, render newsletters via Jinja templates.
- **Output**: Personalized newsletters saved under `app/output/` and sent through Brevo transactional email.
- **Persistence**: Intermediate data cached in MongoDB (`stockbrew_stuff` database) and JSON files in `app/data/`.

## Requirements
- Python 3.11+
- Access to external services: NewsAPI, Google Gemini, MongoDB Atlas, Baserow, Brevo (Sendinblue)
- Recommended: `virtualenv` or `pyenv` for isolated environments

Install dependencies:

```
pip install -r requirements.txt
```

## Environment Variables
Create `app/.env` with the following keys:

| Key | Purpose |
|-----|---------|
| `NEWS_API_KEY_PROD` | NewsAPI key used in `fetch_news.py` |
| `GEMINI_API_KEY_PROD` | Google Gemini API key for summary + refinement |
| `BREVO_API_KEY` | Brevo transactional email API key |
| `MONGODB_URI` | Connection string to MongoDB Atlas cluster |
| `BASEROW_API_TOKEN` | Auth token for Baserow table with subscriber data |

Optional/testing helpers:
- `HOT_STOCKS_*` collections exist in MongoDB for future expansion.
- Adjust `NEWS_API_KEY_PROD` / `GEMINI_API_KEY_PROD` to staging variants if desired.

## Key Scripts

| Script | Description |
|--------|-------------|
| `scripts/run_newsletter_pipeline.py` | Orchestrates the full workflow (idempotent per day) |
| `scripts/utils.py` | Baserow helpers, input preparation |
| `scripts/fetch_news.py` | Fetches news and article content per stock |
| `scripts/generate_summary.py` | Summarizes recent articles with Gemini |
| `scripts/generate_newsletter.py` | Refines summaries, renders HTML, optionally sends email |
| `scripts/send_emails.py` | Standalone Brevo sender for an existing HTML file |
| `scripts/clear_db.py` | Utility to wipe MongoDB collections (use cautiously) |

Templates live in `templates/`. Generated newsletters are saved to `output/`. API inputs/outputs cache under `data/`.

## Running the Pipeline

1. Ensure `app/.env` is populated and MongoDB/Baserow/Brevo credentials are valid.
2. Prepare a Python virtual environment and install dependencies.
3. Execute:

```
python scripts/run_newsletter_pipeline.py
```

The script performs:
1. Pull active subscriptions from Baserow and build `data/stocks_input.json`.
2. Fetch news for required tickers (skips if already fetched today).
3. Generate AI summaries and store them in MongoDB (`regular_stocks_summaries`).
4. Refine summaries, generate HTML, and email each subscriber with relevant content.
5. Save rendered HTML per subscriber in `output/` for auditing.

### Running Steps Individually
Useful while developing or troubleshooting:

```
# Build stocks input JSON from Baserow
python scripts/utils.py  # or call prepare_stocks_input() from an interpreter

# Fetch and cache news
python scripts/fetch_news.py

# Summarize articles with Gemini
python scripts/generate_summary.py

# Refine summaries and save newsletter locally (no send)
python scripts/generate_newsletter.py <email> "TICKER1, TICKER2, ..."

# Send an existing newsletter HTML via Brevo
python scripts/send_emails.py
```

### Managing MongoDB Data
- Collections used today: `regular_stocks_news`, `regular_stocks_summaries`, `regular_stocks_refined_summaries`.
- Hot stocks equivalents exist but are not wired into the pipeline yet.
- Use `scripts/clear_db.py` to wipe all collections when resetting the environment.

## Data Artifacts
- `data/stocks_input.json` &mdash; Tickers + search terms generated from Baserow.
- `data/news_content.json` &mdash; Cached NewsAPI + scraped article payloads.
- `data/summaries.json` &mdash; Latest AI summaries (legacy local cache).
- `output/newsletter_<email>_<YYYYMMDD>.html` &mdash; Rendered newsletters per subscriber.

## Scheduling
- The orchestrator is safe to run multiple times per day; it checks MongoDB for the current date before re-fetching or re-summarizing.
- Common options: cron job, APScheduler within a long-running process, or external workflow tools (Airflow, Prefect, etc.).
- Consider adding logging/alerting around non-zero exits when running in production.

## Troubleshooting
- **Missing summaries/news**: Confirm MongoDB connection and that `NEWS_API_KEY_PROD` / `GEMINI_API_KEY_PROD` are set.
- **403 fetching article content**: Many publishers block scraping; the system logs errors but continues. Summaries skip entries without meaningful content.
- **Gemini JSON parsing errors**: The summarizer strips code fences and falls back to original summaries on failure. Review console output for malformed responses.
- **Emails not sending**: Check Brevo API quotas, verified sender address, and ensure `BREVO_API_KEY` is active.
- **Baserow access errors**: Verify the token scope and that the table ID/field IDs match `scripts/utils.py` constants.

## Development Notes
- `ImageUpload` in the frontend currently uses mocked OCR results; pipeline expects validated ticker lists from Baserow.
- Tailor prompt wording in `generate_summary.py` / `generate_newsletter.py` to adjust tone.
- Avoid committing `.env`, `data/`, and `output/` artifacts (already covered by `.gitignore`).


