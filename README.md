# StocksBrew

AI-assisted daily stock-newsletter service that personalizes coverage for each subscriber. The repository hosts two deployable apps:
- `app/` &mdash; Python pipeline that fetches news, summarizes it with Google Gemini, assembles HTML newsletters, and sends them via Brevo.
- `homepage/` &mdash; Next.js marketing site where users subscribe, manage preferences, and browse recent summaries.

## What StocksBrew Delivers
- **Personalized briefings:** Summaries focus on the tickers each subscriber selected in Baserow or on the site.
- **Daily automation:** Scheduled run pulls fresh news, generates AI summaries, refines copy, and emails subscribers by 8:00 AM local time.
- **Beginner-friendly tone:** Prompting keeps outputs concise, emoji-enhanced, and free from trading advice.
- **Self-serve marketing site:** Prospects can subscribe, explore recent newsletters, and unsubscribe without operator involvement.

## High-Level Architecture
1. **Subscriptions**
   - Users submit email + watchlist through the Next.js site (`/api/subscribe`).
   - Records are stored in a Baserow table (`table 564618`), with status tracking for opt-ins/outs.
2. **Daily pipeline (`app/`)**
   - `run_newsletter_pipeline.py` orchestrates news ingestion, summarization, refinement, newsletter generation, and email delivery.
   - Intermediate artifacts live both in MongoDB (`stockbrew_stuff` database) and under `app/data/` for inspection.
3. **Delivery**
   - Newsletters render via Jinja templates, then send through Brevo (Sendinblue) transactional email API.
4. **Marketing site (`homepage/`)**
   - Presents the value proposition and features (animated hero, subscription form, OCR-assisted portfolio import, explore timeline, unsubscribe flow).
   - Pulls published summaries from MongoDB to showcase real examples (`/api/summaries`).

```
Subscriber ➜ Next.js API ➜ Baserow ➜ Python pipeline
            ▲              │            │
            │              ▼            ▼
         Explore UI   MongoDB ↔ Gemini ↔ NewsAPI
            │                            │
            └──────────── Brevo (Email) ◀─┘
```

## Repository Layout

| Path        | Purpose                                                                 |
|-------------|-------------------------------------------------------------------------|
| `app/`      | Python scripts, data caches, templates, and output newsletters          |
| `homepage/` | Next.js (App Router) marketing site with subscription and explore views |

Each sub-project has its own README with setup, configuration, and runtime instructions.

## Quick Start

1. **Clone & install prerequisites**
   - Python 3.11+ with `pip` for the pipeline.
   - Node.js 18+ and npm for the Next.js frontend.
2. **Configure secrets**
   - Copy `app/.env.example` (create one) and `homepage/.env.local` (create) with the environment variables listed in the sub-project READMEs.
3. **Run components**
   - Follow `app/README.md` to execute the daily pipeline or individual scripts.
   - Follow `homepage/README.md` to launch the marketing site locally (`npm run dev`).

## Data & Integrations
- **NewsAPI + Google News scraping** for article discovery.
- **Google Gemini** (`gemini-2.5-flash`) for summarization and refinement.
- **MongoDB Atlas** (`stockbrew_stuff` database) for storing news, summaries, and refined outputs.
- **Baserow** for subscriber management.
- **Brevo (Sendinblue)** for transactional email delivery.

## Automation & Scheduling
- The orchestration script `app/scripts/run_newsletter_pipeline.py` performs idempotent checks: it only fetches/generates data missing for the current date.
- Schedule the pipeline via cron, APScheduler, or a task runner to hit the desired daily send time.
- Outputs per subscriber appear in `app/output/` for auditing.

## Contributing

1. Read the sub-project READMEs.
2. Create topic branches per change.
3. Run linting/tests when available (`homepage`: `npm run lint`).
4. Submit pull requests with clear descriptions; ensure secrets are never committed.

## Support & Roadmap Ideas
- Extend hot-stocks flow (collections exist in MongoDB but are not fully wired).
- Harden OCR-powered symbol extraction (currently mocked in `ImageUpload`).
- Add automated tests and CI for both pipeline and frontend.
- Document monitoring/alerting around pipeline runs.

## License

Add your preferred open-source license here before publishing publicly.

