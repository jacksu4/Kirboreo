# Changelog

All notable changes to the Kirboreo AI platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive test suite with Jest and React Testing Library
- Vercel deployment configuration with Hong Kong region optimization
- Contributing guidelines and development workflow documentation
- Environment variable template (.env.example)

### Changed
- Converted all Chinese comments to English
- Integrated PROJECT_SUMMARY into main README
- Enhanced README with detailed architecture and setup instructions

### Removed
- Debug scripts (debug-yahoo.js, debug-yahoo-intraday.js)
- Temporary test files and documentation
- Reference documents not needed in production

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

