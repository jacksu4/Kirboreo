# Changelog

All notable changes to the Kirboreo AI platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive test suite with Jest and React Testing Library (20 test suites, 146 tests)
- Vercel deployment configuration with Hong Kong region optimization
- Docker support with Dockerfile and .dockerignore
- Environment variable template and documentation
- Contact form with Resend email integration
- AI Labs section with FOMO Meter feature
- Smart ticker resolution (company name → ticker symbol mapping)
- News relevance filtering for ambiguous tickers (PATH, COIN, etc.)
- Rate limiting and caching for FOMO Meter API

### Changed
- Converted all Chinese comments to English across codebase
- Enhanced README with deployment instructions, contributing guidelines, and FOMO Meter documentation
- Consolidated 11 separate MD files into comprehensive README and CHANGELOG
- Improved documentation structure and readability
- Optimized project organization and file structure

### Fixed
- FOMO Meter news filtering to show only ticker-relevant headlines
- Ticker resolution to support company names (e.g., "UIPath" → "PATH")
- Background3D component React 19 compatibility
- Test coverage for all core components and utilities

### Removed
- Debug scripts (debug-yahoo.js, debug-yahoo-intraday.js)
- Temporary test files and documentation
- Reference documents: CHANGES_SUMMARY.md, CLEANUP_SUMMARY.md, CONTACT_FORM_SETUP.md
- Redundant documentation files: CONTRIBUTING.md, DEPLOYMENT_GUIDE.md, PROJECT_STATUS.md
- FOMO Meter documentation files (consolidated into README)

## [1.0.0] - 2024-11-19

### Added
- 🤖 RAG-powered AI chat interface using GPT-4o and Pinecone
- 📊 Real-time stock analysis with Yahoo Finance integration
- 📝 Research library powered by Sanity CMS
- 📈 Interactive multi-timeframe stock charts with Recharts
- 🎨 Modern glass-morphism UI with 3D backgrounds (Three.js)
- 🏢 About page with founder profile and company story
- 🔍 Semantic search for research content
- 📱 Responsive design for mobile and desktop

### Core Features

#### AI Chat System
- Retrieval-Augmented Generation (RAG) pipeline
- Vector search with Pinecone (1536-dim embeddings)
- Streaming responses for real-time interaction
- Graceful degradation when context unavailable
- Error handling and retry logic

#### Stock Analysis
- Support for multiple timeframes (1d, 5d, 1mo, 6mo, ytd, 1y, 5y)
- Intraday data with 15-minute intervals
- Real-time price updates
- Related research article recommendations
- Kirboreo proprietary scoring system

#### Content Management
- Sanity.io headless CMS integration
- Rich text content with block editor
- Category-based filtering
- Author profiles and attribution
- SEO-optimized content structure

#### FOMO Meter (AI Labs)
- Real-time sentiment analysis for stocks and cryptocurrencies
- GPT-4o powered overall sentiment with witty commentary
- Keyword-based per-headline sentiment indicators
- Dynamic background colors (Fear/Greed scale)
- Thermometer visualization (0-100 scale)
- 5-minute caching and rate limiting (5 req/min per IP)

### Technical Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **AI**: OpenAI GPT-4o, text-embedding-3-small
- **Database**: Pinecone vector database
- **CMS**: Sanity.io
- **Styling**: CSS Modules, Tailwind CSS
- **Charts**: Recharts
- **3D Graphics**: React Three Fiber
- **Data**: Yahoo Finance API
- **Email**: Resend API

### Infrastructure
- Deployed on Vercel
- Hong Kong, Singapore, Seoul regions
- HTTPS with automatic SSL
- Environment variable management
- API route optimization (60s timeout, 1GB memory)

### Security
- Server-side API key management
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Security headers (X-Frame-Options, CSP)

### Testing & Quality
- Jest test configuration with JSDOM environment
- 20 test suites covering components, APIs, and utilities
- Integration tests for chat flow
- Code coverage reporting
- ESLint and TypeScript strict mode

### Documentation
- Comprehensive README with setup and deployment instructions
- Detailed architecture documentation
- Contributing guidelines
- Environment variable templates
- API documentation

---

## Release Notes Format

### Types of Changes
- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Features that will be removed soon
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security vulnerability fixes

---

For more details, see the [GitHub Releases](https://github.com/YOUR_USERNAME/Kirboreo/releases).

