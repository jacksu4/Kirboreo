# Kirboreo AI

> Tech-driven investment research platform combining institutional-grade analysis with cutting-edge AI technology.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

**Kirboreo Limited** is a Hong Kong-based investment research firm dedicated to decoding the complex world of global technology equities. This platform delivers hedge-fund-grade insights with engineering precision through an AI-powered research interface.

---

## 🚀 Features

- **🤖 AI Chat Interface**: RAG-powered conversational AI using GPT-4o and Pinecone vector database
- **📊 Real-Time Stock Analysis**: Live market data and technical analysis for US tech stocks
- **📝 Research Library**: Curated equity research powered by Sanity CMS
- **📈 Interactive Charts**: Multi-timeframe stock visualizations with Recharts
- **🎨 Modern UI**: Glass-morphism design with 3D backgrounds using Three.js

---

## 📋 Tech Stack

### Core Framework
- **Next.js 15** (App Router) - React framework with server components
- **TypeScript** - Type-safe development
- **React 19** - Latest React features

### AI & Data
- **OpenAI GPT-4o** - Chat completion and reasoning
- **OpenAI Embeddings** (`text-embedding-3-small`) - Semantic search
- **Pinecone** - Vector database for RAG (index: `knowledge`)
- **Vercel AI SDK** - Streaming responses and tool integration

### Content & Data Sources
- **Sanity.io** - Headless CMS for research content
- **Yahoo Finance** (`yahoo-finance2`) - Real-time market data

### UI & Visualization
- **CSS Modules** + **Tailwind CSS** - Styling
- **Recharts** - Stock charts and data visualization
- **React Three Fiber** - 3D backgrounds and effects
- **Lucide React** - Icon library

---

## 🏗️ Project Structure

```
Kirboreo/
├── app/                      # Next.js App Router
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # RAG-powered chat API endpoint
│   ├── chat/
│   │   └── page.tsx          # Chat interface
│   ├── analysis/
│   │   └── [ticker]/         # Dynamic stock analysis pages
│   ├── research/
│   │   └── [slug]/           # Research article pages
│   ├── about/                # About page
│   ├── studio/               # Embedded Sanity Studio
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
│
├── components/               # React components
│   ├── ChatWidget.tsx        # Floating chat component
│   ├── StockAnalysis.tsx     # Stock chart & metrics
│   ├── Hero.tsx              # Landing hero section
│   ├── Navbar.tsx            # Navigation
│   ├── FeaturedReports.tsx   # Latest research
│   ├── Background3D.tsx      # Three.js background
│   └── ui/                   # Reusable UI components
│
├── lib/                      # Core utilities
│   ├── vector-store.ts       # Pinecone integration
│   ├── yahoo.ts              # Stock data fetching
│   └── utils.ts              # Helper functions
│
├── sanity/                   # Sanity CMS configuration
│   ├── schemaTypes/          # Content models
│   │   ├── postType.ts       # Research articles
│   │   ├── stockAnalysisType.ts
│   │   └── ...
│   └── lib/
│       ├── client.ts         # Sanity client
│       └── queries.ts        # GROQ queries
│
├── scripts/                  # Utility scripts
│   └── index-sanity-data.ts  # Sync content to Pinecone
│
├── __tests__/                # Test suites
│   ├── api/
│   ├── components/
│   └── lib/
│
└── public/                   # Static assets
```

---

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key
- Pinecone account (free tier works)
- Sanity.io project

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/Kirboreo.git
cd Kirboreo
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Pinecone
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX_NAME=knowledge

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk...
```

### 4. Initialize Pinecone index
Ensure your Pinecone index has:
- **Dimension**: 1536 (for `text-embedding-3-small`)
- **Metric**: Cosine similarity
- **Region**: Asia-Pacific (recommended for Hong Kong)

### 5. Seed data (optional)
Index your Sanity content into Pinecone:
```bash
npm run index-data
# or manually:
npx tsx scripts/index-sanity-data.ts
```

### 6. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

Test structure:
- `__tests__/api/` - API route tests
- `__tests__/components/` - Component unit tests
- `__tests__/lib/` - Utility function tests
- `__tests__/integration/` - End-to-end tests

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

This project uses React 19. The `.npmrc` configuration with `legacy-peer-deps=true` is already set up to avoid peer dependency conflicts.

1. **Push to GitHub**:
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

2. **Import to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables (same as `.env.local`)
   - Deploy!

**Environment Variables to Configure:**
- `OPENAI_API_KEY` - OpenAI API key
- `PINECONE_API_KEY` - Pinecone API key
- `PINECONE_INDEX_NAME` - Pinecone index name (default: `knowledge`)
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset (default: `production`)
- `SANITY_API_TOKEN` - Sanity API token
- `RESEND_API_KEY` - (Optional) Resend API key for contact form

3. **Region Configuration** (Optional):
The `vercel.json` file is configured for Hong Kong, Singapore, and Seoul regions with optimized function settings:
- Function timeout: 60 seconds
- Memory: 1024MB

### Alternative: Docker
```bash
docker build -t kirboreo .
docker run -p 3000:3000 --env-file .env.local kirboreo
```

### Post-Deployment Checklist
- [ ] Verify homepage loads
- [ ] Test AI chat at `/chat`
- [ ] Check stock analysis pages
- [ ] Verify research articles load
- [ ] Test contact form (if RESEND_API_KEY configured)
- [ ] Monitor Vercel Analytics for performance

---

## 🏛️ Architecture

### RAG (Retrieval-Augmented Generation) Pipeline

```
User Query
    ↓
1. Embed query (OpenAI text-embedding-3-small)
    ↓
2. Retrieve top-K contexts (Pinecone vector search)
    ↓
3. Inject context into system prompt
    ↓
4. Generate response (GPT-4o)
    ↓
5. Stream response to client
```

**Implementation**: [`app/api/chat/route.ts`](app/api/chat/route.ts)

### Stock Data Flow

```
User selects ticker/timeframe
    ↓
Server Action (app/actions/stock.ts)
    ↓
Yahoo Finance API
    ↓
Transform & cache
    ↓
Render chart (Recharts)
```

---

## 📊 Data Sources

| Source | Purpose | Update Frequency |
|--------|---------|------------------|
| Yahoo Finance | Stock prices, charts | Real-time |
| Sanity CMS | Research articles | Manual publish |
| Pinecone | Vector search context | Indexed on content update |
| OpenAI | Embeddings, chat | API call |

---

## 🎯 Key Features Explained

### 1. AI Chat with RAG
- **Context-aware responses**: Retrieves relevant research content before answering
- **Streaming**: Real-time response generation
- **Graceful degradation**: Falls back to general knowledge if no context found

### 2. Stock Analysis
- **Multi-timeframe support**: 1d, 5d, 1mo, 6mo, ytd, 1y, 5y
- **Intraday data**: 15-minute intervals for recent data
- **Related research**: Auto-links to relevant articles from Sanity

### 3. Research Library
- **Full-text search**: Powered by Sanity's GROQ queries
- **Category filtering**: Tech sectors (AI, Cloud, SaaS, etc.)
- **Rich content**: Block content with code snippets, images, tables

---

## 🔐 Security

- ✅ API keys stored in environment variables only
- ✅ Server-side API calls (no client-side key exposure)
- ✅ Input validation and sanitization
- ✅ Rate limiting on API routes (Vercel default)
- ✅ HTTPS enforced in production

---

## 🛣️ Roadmap

- [ ] Real-time alerts for stock movements
- [ ] User authentication and saved watchlists
- [ ] Advanced charting (technical indicators)
- [ ] Multi-language support (English, Chinese)
- [ ] Mobile app (React Native)
- [ ] Backtesting framework for strategies

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## 🧪 AI Labs

The platform includes experimental AI features in the `/labs` section:

### FOMO Meter
Real-time sentiment analysis for stocks and cryptocurrencies powered by:
- **Yahoo Finance**: News and price data
- **GPT-4o**: AI-driven sentiment analysis with witty commentary
- **Keyword Analysis**: Per-headline sentiment indicators

**Features:**
- Dynamic background colors based on sentiment (Fear/Greed scale)
- Thermometer visualization (0-100 scale)
- Smart ticker resolution (company name → ticker symbol)
- News filtering for relevant headlines only
- 5-minute caching with rate limiting

**Try it:** Visit `/labs/fomo-meter` and enter a ticker (e.g., TSLA, BTC-USD, AAPL)

---

## 👥 Contributing

Contributions are welcome! Please follow these guidelines:

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with tests
4. Ensure all tests pass: `npm test`
5. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation updates
   - `test:` - Test additions
   - `refactor:` - Code refactoring
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards
- Use TypeScript with explicit types
- Write tests for new features (aim for >80% coverage)
- Follow existing code style
- Add JSDoc comments for public APIs
- Ensure `npm run build` and `npm run lint` pass

---

## 📧 Contact

**Kirboreo Limited**  
Central, Hong Kong  
Email: contact@kirboreo.com  
Website: [kirboreo.com](https://kirboreo.com)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [Vercel](https://vercel.com) - Deployment platform
- [Pinecone](https://pinecone.io) - Vector database
- [OpenAI](https://openai.com) - AI models
- [Sanity.io](https://sanity.io) - Headless CMS
- [Yahoo Finance](https://finance.yahoo.com) - Market data

---

**Built with ❤️ by Jingcheng Su**  
*Where Silicon Valley Engineering Meets Wall Street Rigor*
