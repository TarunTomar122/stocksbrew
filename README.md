# StocksBrew 🍺

**AI-Powered Stock Newsletter Platform for Indian Markets**

An end-to-end automated system that generates personalized stock newsletters using AI-powered news analysis and delivers them via email to subscribers.

## 🏗️ Architecture Overview

StocksBrew is a **serverless, GitHub Actions-powered** newsletter automation system:

### 1. Frontend (`homepage/`)
- **Landing Page**: Interactive website for user subscriptions
- **Technology Stack**: Vanilla HTML/CSS/JavaScript + Tailwind CSS
- **Features**: Email subscription, stock selection (40+ stocks), responsive design
- **Deployment**: Vercel with serverless API functions

### 2. Automation System (`.github/workflows/`)
- **Pipeline Execution**: GitHub Actions workflows (no traditional backend)
- **Scheduled Jobs**: Daily newsletter generation at 7:00 AM IST
- **Manual Triggers**: On-demand pipeline execution
- **Data Processing**: Python scripts for news fetching, AI analysis, and email delivery

### 3. Data Layer
- **Subscriber Management**: Airtable/Baserow for user data
- **Content Storage**: MongoDB for news content and summaries
- **AI Processing**: Google Gemini 2.5 Flash for content generation
- **Email Delivery**: Brevo API for newsletter distribution

## 🔄 GitHub Actions Pipeline

### Automated Workflows

#### 1. **Daily Newsletter Generation** (`newsletter.yml`)
**Schedule**: 7:00 AM IST daily (1:30 UTC)
**Trigger**: Automatic + Manual dispatch

```yaml
on:
  schedule:
    - cron: '30 1 * * *'  # 7:00 AM IST daily
  workflow_dispatch:  # Manual trigger
```

#### 2. **Micro Services Newsletter** (`micro_services_newsletter.yml`) 
**Trigger**: Manual dispatch only
**Purpose**: Testing and manual newsletter generation

#### 3. **Database Cleanup** (`clear_db.yml`)
**Trigger**: Manual dispatch only
**Purpose**: Clear MongoDB collections for testing

### Pipeline Flow

```
GitHub Actions Runner (ubuntu-latest)
├── 1. Setup Environment
│   ├── Checkout repository
│   ├── Setup Python 3.10
│   └── Install dependencies
├── 2. Data Collection
│   ├── Fetch subscriber data from Baserow/Airtable
│   ├── Get unique stocks from subscriptions
│   └── Fetch news from Google News RSS + NewsAPI
├── 3. AI Processing
│   ├── Generate summaries using Gemini AI
│   ├── Refine content and remove redundancy
│   └── Apply content quality guidelines
├── 4. Newsletter Generation
│   ├── Load HTML templates (Jinja2)
│   ├── Personalize content per subscriber
│   └── Generate final HTML newsletters
└── 5. Email Delivery
    ├── Send via Brevo API
    └── Log delivery status
```

## 📊 Database Schema

### MongoDB Collections

**Database**: `stockbrew_stuff`

#### `regular_stocks_news`
```json
{
  "_id": "ObjectId",
  "date": "2025-01-27",
  "news_data": {
    "stocks_news": [
      {
        "stock_info": {
          "symbol": "RELIANCE",
          "company_name": "Reliance Industries",
          "search_terms": ["reliance company stocks news"]
        },
        "articles": [
          {
            "title": "Article title",
            "url": "https://...",
            "published_at": "2025-01-27T10:00:00Z",
            "full_content": "Article content...",
            "search_term": "reliance company stocks news"
          }
        ]
      }
    ]
  }
}
```

#### `regular_stocks_summaries`
```json
{
  "_id": "ObjectId",
  "date": "2025-01-27",
  "summaries": {
    "RELIANCE": {
      "tldr": "📈 Brief 2-sentence summary of key developments",
      "sentiment": "positive",
      "key_points": [
        "🔥 Point 1 with specific numbers",
        "📊 Point 2 with impact details"
      ],
      "action_items": [
        "👀 What to monitor",
        "📈 Key metrics to track"
      ]
    }
  }
}
```

#### `regular_stocks_refined_summaries`
```json
{
  "_id": "ObjectId", 
  "date": "2025-01-27",
  "refined_summaries": {
    // Same structure as summaries but refined by AI
    // Removes redundancy and improves clarity
  }
}
```

#### Hot Stocks Collections
- `hot_stocks_news` - Similar to regular_stocks_news
- `hot_stocks_summaries` - Similar to regular_stocks_summaries  
- `hot_stocks_refined_summaries` - Similar to regular_stocks_refined_summaries

### Airtable Schema

**Base ID**: `app3Pnv4423RRK52w`
**Table ID**: `tblptL5RJrvRLAWzg`

```json
{
  "Email": "user@example.com",
  "Selected Stocks": "RELIANCE, TCS, INFY, HDFCBANK",
  "Subscribed At": "2025-01-27T10:30:00.000Z",
  "Status": "active"
}
```

## 🛠️ Technical Stack

### Frontend
- **Framework**: Vanilla JavaScript (no frameworks)
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **Deployment**: Vercel
- **Features**: Responsive design, stock search, form validation

### Infrastructure
- **Automation**: GitHub Actions (ubuntu-latest runners)
- **Frontend Hosting**: Vercel
- **Database**: MongoDB Atlas
- **Subscriber Management**: Airtable/Baserow
- **Email Delivery**: Brevo
- **AI Processing**: Google Gemini API
- **News Sources**: NewsAPI + Google News RSS

## 📋 Project Status & Roadmap

### ✅ Current Features
- [x] Automated daily newsletter generation via GitHub Actions
- [x] AI-powered news summarization using Gemini 2.5 Flash
- [x] Personalized content per subscriber
- [x] Responsive landing page with stock selection
- [x] Email subscription system
- [x] Scheduled pipeline execution (7:00 AM IST daily)
- [x] Serverless architecture with no backend maintenance
- [x] Hot stocks detection and integration
- [x] Content refinement and quality control

### 🔄 In Progress
- [ ] Newsletter template optimization
- [ ] Error handling improvements

### 📝 Planned Features (User Feedback Integration)

**From Yash Shenai:**
- [ ] **Stock Monitoring Tips**: Add specific parameters to monitor for each stock
- [ ] **Actionable Insights**: Provide clear guidance on what to watch out for
- [ ] **Report Integration**: Explore MarketSmith India and ValueResearch Online data
- [ ] **Technical Analysis**: Include key technical indicators and levels

**From Monisha:**
- [ ] **Monitoring Guidance**: Clear instructions on what to watch for each stock
- [ ] **Personalized Suggestions**: AI-generated recommendations based on user's portfolio
- [ ] **Alert System**: Notifications for significant stock movements
- [ ] **Educational Content**: Beginner-friendly explanations of stock concepts

### 🎯 Technical Roadmap
- [ ] **A/B Testing**: Newsletter format and content variations
- [ ] **Analytics Dashboard**: User engagement and newsletter performance metrics

## 🚀 Development Setup

### Prerequisites
- GitHub account (for Actions)
- MongoDB Atlas account  
- Airtable/Baserow account
- Brevo API key
- Google Gemini API key
- NewsAPI key

### Local Development
```bash
# Clone the repository
git clone https://github.com/your-username/stocksbrew.git
cd stocksbrew

# Frontend development
cd homepage/
# Open index.html in browser (no build process required)

# Test Python scripts locally
cd app/
pip install -r requirements.txt
python -m scripts.run_newsletter_pipeline
```

### GitHub Actions Setup
```bash
# Required GitHub Secrets
BREVO_API_KEY=your_brevo_api_key
AIRTABLE_API_KEY=your_airtable_api_key  
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=your_table_name
GEMINI_API_KEY=your_gemini_api_key
NEWSAPI_KEY=your_newsapi_key
```

### Manual Workflow Triggers
- **Daily Newsletter**: Actions → "Daily Newsletter Generation" → Run workflow
- **Database Cleanup**: Actions → "Clear DB" → Run workflow  
- **Testing**: Actions → "Micro Services Newsletter" → Run workflow

## 🔧 Pipeline Scripts

### Core Scripts (`app/scripts/`)

1. **`run_newsletter_pipeline.py`**: Main orchestrator executed by GitHub Actions
2. **`fetch_news.py`**: News aggregation from Google News RSS and NewsAPI
3. **`generate_summary.py`**: AI-powered content summarization via Gemini
4. **`generate_newsletter.py`**: HTML newsletter generation with Jinja2
5. **`send_emails.py`**: Email delivery via Brevo API

### Utility Scripts

- **`db.py`**: MongoDB connection and configuration
- **`utils.py`**: Helper functions for Baserow/Airtable API calls
- **`clear_db.py`**: Database cleanup utilities (manual trigger)

### Execution Flow

```
GitHub Actions Trigger
│
├── Environment Setup (Python 3.10, dependencies)
│
├── run_newsletter_pipeline.py
    │
    ├── manage_hot_stocks()
    │   ├── fetch_news(hot_stocks=True)
    │   ├── generate_summary(hot_stocks=True)  
    │   └── refine_summaries()
    │
    ├── manage_regular_stocks()
    │   ├── get_unique_stocks_from_baserow()
    │   ├── fetch_news(hot_stocks=False)
    │   ├── generate_summary(hot_stocks=False)
    │   └── refine_summaries()
    │
    └── send_newsletters()
        ├── get_all_entries_from_baserow()
        ├── generate_newsletter() for each subscriber
        └── send_newsletter_email()
```

## 🎨 Newsletter Template

The newsletter uses a responsive HTML template (`app/templates/newsletter_template.html`) with:

- **Sections**: Header, User Watchlist, Hot Stocks, Footer
- **Styling**: Inline CSS for email client compatibility
- **Template Engine**: Jinja2 for dynamic content rendering
- **Responsive Design**: Mobile-optimized layout
- **Personalization**: User-specific stock selections

## 📊 Content Guidelines

### AI Content Generation Rules
- **No Trading Advice**: Never suggest buying/selling stocks
- **No Price Targets**: Avoid specific price predictions
- **Educational Focus**: Provide monitoring guidance instead
- **Beginner-Friendly**: Use simple language and explanations
- **Emoji Usage**: Visual elements for better engagement
- **Concise Format**: TLDR + key points + action items

### Content Quality Standards
- Maximum 2 sentences for TLDR
- 3-5 key points per stock
- 2-3 actionable monitoring items
- Remove redundant information across stocks
- Focus on price-impacting news only

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (both frontend and backend)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards
- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ES6+ features, maintain consistent formatting
- **Comments**: Document complex logic and API integrations
- **Error Handling**: Implement proper exception handling
- **Testing**: Write tests for new features

### Areas for Contribution
- **AI Prompt Engineering**: Improve content generation quality
- **Frontend Enhancement**: Better UI/UX for subscription flow
- **Pipeline Optimization**: Performance improvements
- **Monitoring & Analytics**: User engagement tracking
- **Documentation**: API documentation and tutorials
- **Testing**: Unit and integration tests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Production URL**: [StocksBrew Homepage](https://stocksbrew.vercel.app)
- **GitHub Actions**: Repository → Actions tab
- **Database**: MongoDB Atlas
- **Email Service**: Brevo
- **AI Engine**: Google Gemini 2.5 Flash

---

*Built with ❤️ for the Indian stock market community*