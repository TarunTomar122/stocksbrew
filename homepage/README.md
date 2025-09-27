# StocksBrew Homepage (`homepage/`)

Marketing and subscriber-facing site built with Next.js (App Router) and Tailwind CSS. It captures watchlists, showcases recent AI summaries, and provides unsubscribe flows.

## Features
- **Hero landing page** with animated background, value props, and CTA buttons.
- **Subscription flow**
  - `SubscriptionForm` collects email and watchlist symbols.
  - `StockSearch` with fuzzy lookup across Indian + international tickers.
  - `ImageUpload` (prototype) simulates OCR extraction of tickers from portfolio screenshots.
  - Posts to `/api/subscribe`, which adds/updates entries in Baserow.
- **Explore page** (`/explore`)
  - Server component fetches the latest 10 days of summaries from MongoDB via `getSummaries()`.
  - Client timeline UI lets visitors browse day-by-day stock insights.
- **Unsubscribe page** (`/unsubscribe`)
  - Prefills email from query string and calls `/api/unsubscribe` to mark the subscriber inactive.
- **Responsive design** using Tailwind utility classes and Font Awesome icons.

## Requirements
- Node.js 18+
- npm (bundled with Node 18)
- Access to MongoDB Atlas + Baserow

Install dependencies:

```
npm install
```

## Environment Variables
Create `homepage/.env.local` with:

| Key | Purpose |
|-----|---------|
| `MONGODB_URI` | Connection string for fetching summaries (SSG/ISR + API routes) |
| `BASEROW_API_TOKEN` | Token for POST/PATCH requests to the subscriptions table |

Optional: configure analytics or additional feature flags as needed.

## Scripts

```
npm run dev     # Start local dev server on http://localhost:3000
npm run build   # Production build
npm start       # Run production build locally
npm run lint    # ESLint checks (Next.js config)
```

## Project Structure

| Path | Description |
|------|-------------|
| `app/` | App Router routes (`page.tsx`, `explore/page.tsx`, `unsubscribe/page.tsx`, API routes) |
| `components/` | UI components: header, background, forms, explore timeline |
| `lib/` | Helpers (ticker lists, MongoDB data fetcher) |
| `public/` | Static assets (`logo.png`) |
| `tailwind.config.js` | Tailwind setup |
| `tsconfig.json` | TypeScript config |

## API Routes
- `POST /api/subscribe`
  - Validates email + watchlist.
  - Writes to Baserow `table 564618`, setting status to `active` and storing tickers as comma-separated string.
- `POST /api/unsubscribe`
  - Looks up the subscriber in Baserow and updates status to `unsubscribed`.
- `GET /api/summaries`
  - Returns the latest 10 entries from MongoDB `stockbrew_stuff.regular_stocks_summaries`.
  - Primarily used for pre-rendering, but accessible as JSON.

## Data Flow
1. User subscribes → Baserow row created.
2. AI pipeline (`app/`) fetches subscribers from Baserow and generates newsletters.
3. Explore page fetches recent summaries from MongoDB to display example outputs.
4. Unsubscribe route toggles status in Baserow to stop future sends.

## Development Notes
- `ImageUpload` currently returns mocked tickers; integrate real OCR (e.g., Tesseract.js) in future iterations.
- The explore page uses incremental static regeneration (`revalidate = 86400`) so it refreshes once daily.
- Tailwind classes rely on PostCSS build step (configured via `postcss.config.js` and `tailwind.config.js`).
- Vercel deployment is configured via `vercel.json` (build command, region, function timeout).

## Testing
- Manual: `npm run lint` and interact with pages locally.
- Production monitoring: ensure Baserow/MongoDB credentials are configured via Vercel environment variables before deployment.
