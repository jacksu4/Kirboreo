import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { resolveTickerFromInput, getCompanyName } from '@/lib/ticker-mappings';

export const maxDuration = 60;

// Initialize Yahoo Finance
const yahooFinance = new YahooFinance();

// Simple in-memory cache (5 minutes TTL)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Simple rate limiter (5 requests per minute per IP)
const rateLimiter = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimiter.get(ip) || [];
  
  // Clean up requests older than 1 minute
  const recentRequests = requests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= 5) {
    return false; // Rate limit exceeded
  }
  
  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);
  return true;
}

function getCachedData(ticker: string) {
  const cached = cache.get(ticker.toUpperCase());
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`Cache hit for ${ticker}`);
    return cached.data;
  }
  return null;
}

function setCachedData(ticker: string, data: any) {
  cache.set(ticker.toUpperCase(), {
    data,
    timestamp: Date.now()
  });
}

interface NewsItem {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  sentiment?: 'bullish' | 'neutral' | 'bearish';
}

/**
 * Checks if a news headline is relevant to the given ticker
 * Uses company name matching and filters out generic "path", "coin" mentions
 */
function isNewsRelevant(headline: string, ticker: string, companyName?: string): boolean {
  const titleLower = headline.toLowerCase();
  const tickerLower = ticker.toLowerCase();
  
  // Always include if ticker is explicitly mentioned (with word boundaries)
  const tickerPattern = new RegExp(`\\b${tickerLower}\\b`, 'i');
  if (tickerPattern.test(titleLower)) {
    return true;
  }
  
  // If we have a company name, check if it's mentioned
  if (companyName) {
    const companyLower = companyName.toLowerCase();
    if (titleLower.includes(companyLower)) {
      return true;
    }
  }
  
  // Special case: filter out generic "path" mentions if ticker is PATH
  if (ticker === 'PATH' && companyName) {
    // Only include if "uipath" is mentioned, exclude generic "path"
    return titleLower.includes('uipath');
  }
  
  // Special case: filter out generic "coin" mentions if ticker is COIN
  if (ticker === 'COIN' && companyName) {
    // Only include if "coinbase" is mentioned, exclude generic "coin" or "bitcoin"
    return titleLower.includes('coinbase');
  }
  
  // For other tickers, default to false (conservative approach)
  return false;
}

async function getNewsFromYahoo(ticker: string, companyName?: string): Promise<NewsItem[]> {
  try {
    console.log(`Fetching news for ${ticker}${companyName ? ` (${companyName})` : ''}`);
    
    // Try to get news using the ticker first
    const searchResult = await yahooFinance.search(ticker, {
      newsCount: 20 // Fetch more to account for filtering
    });

    const news = searchResult.news || [];
    console.log(`Found ${news.length} news items (before filtering)`);

    // Parse all news items first
    const parsedNews = news.map((item: any) => {
      // providerPublishTime is Unix timestamp in seconds
      const timestamp = item.providerPublishTime || 0;
      let publishedAt: string;
      
      try {
        // Check if timestamp is in seconds (10 digits) or milliseconds (13 digits)
        const isSeconds = timestamp.toString().length === 10;
        const date = new Date(isSeconds ? timestamp * 1000 : timestamp);
        
        // Validate the date
        if (isNaN(date.getTime()) || date.getFullYear() < 2000 || date.getFullYear() > 2100) {
          publishedAt = new Date().toISOString(); // Fallback to current time
        } else {
          publishedAt = date.toISOString();
        }
      } catch (error) {
        publishedAt = new Date().toISOString();
      }
      
      return {
        title: item.title || '',
        source: item.publisher || 'Unknown',
        publishedAt,
        url: item.link || '',
      };
    });

    // Filter news for relevance
    const relevantNews = parsedNews.filter(item => 
      isNewsRelevant(item.title, ticker, companyName)
    );

    console.log(`After filtering: ${relevantNews.length} relevant news items`);

    // Return up to 10 relevant items
    return relevantNews.slice(0, 10);
  } catch (error) {
    console.error('Error fetching news from Yahoo:', error);
    return [];
  }
}

async function getCurrentPrice(ticker: string) {
  try {
    const quote = await yahooFinance.quote(ticker);
    return {
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChangePercent || 0,
    };
  } catch (error) {
    console.error('Error fetching price:', error);
    return { price: 0, change: 0 };
  }
}

interface SentimentAnalysis {
  score: number;
  label: string;
  emoji: string;
  commentary: string;
  keywords: string[];
}

async function analyzeSentiment(ticker: string, headlines: NewsItem[]): Promise<SentimentAnalysis> {
  if (headlines.length === 0) {
    return {
      score: 50,
      label: '中性',
      emoji: '😐',
      commentary: '没有足够的新闻数据来分析情绪',
      keywords: []
    };
  }

  const headlinesText = headlines.map((h, i) => `${i + 1}. ${h.title}`).join('\n');

  const prompt = `你是一位专业的金融分析师。请仔细分析以下关于 ${ticker} 的新闻标题，评估市场情绪。

新闻标题（共 ${headlines.length} 条）：
${headlinesText}

请按照以下步骤分析：

1. **情绪评分（0-10分）**：
   - 0-3分：非常看跌（bearish）- 新闻充满负面词汇，如"暴跌"、"崩盘"、"危机"、"抛售"
   - 4-6分：中性（neutral）- 正负面新闻混合，或者新闻相对平淡
   - 7-10分：非常看涨（bullish）- 新闻充满正面词汇，如"暴涨"、"突破"、"创新高"、"看好"

2. **转换为百分制（0-100）**：
   - 将你的0-10分评分 × 10 得到最终分数
   - 例如：7分 → 70分，3分 → 30分

3. **确定标签和表情**：
   - 0-19分：极度恐惧 😱
   - 20-39分：恐惧 😰
   - 40-69分：中性 😐
   - 70-89分：贪婪 😏
   - 90-100分：极度贪婪 🚀

4. **生成犀利点评**（最多50字）：
   - 如果看涨（70+）：提醒投资者保持冷静，警惕追高风险
   - 如果看跌（<40）：提醒可能是抄底机会，但需谨慎
   - 要幽默、讽刺、一针见血

请返回一个 JSON 对象，格式如下：
{
  "rawScore": 7.5,  // 你的原始0-10评分（可以有小数）
  "score": 75,  // 转换为百分制（rawScore × 10）
  "label": "贪婪",
  "emoji": "😏",
  "commentary": "一句话犀利点评",
  "keywords": ["关键词1", "关键词2", "关键词3"]
}

只返回 JSON，不要其他内容。`;

  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt,
      temperature: 0.7,
    });

    console.log('OpenAI response:', text);

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    
    // Validate and ensure score is within bounds
    result.score = Math.max(0, Math.min(100, Math.round(result.score || 50)));
    
    return result;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    
    // Fallback: simple keyword analysis
    const text = headlinesText.toLowerCase();
    let score = 50;
    
    // Positive keywords
    const positiveWords = ['breakthrough', 'surge', 'rally', 'record', 'high', 'bullish', 'growth', '突破', '暴涨', '创新高', '看涨'];
    const negativeWords = ['crash', 'plunge', 'crisis', 'fear', 'drop', 'bearish', 'decline', '暴跌', '崩盘', '危机', '下跌'];
    
    positiveWords.forEach(word => {
      if (text.includes(word)) score += 10;
    });
    
    negativeWords.forEach(word => {
      if (text.includes(word)) score -= 10;
    });
    
    score = Math.max(0, Math.min(100, score));
    
    let label = '中性';
    let emoji = '😐';
    let commentary = '市场情绪中性，观望为主';
    
    if (score >= 90) {
      label = '极度贪婪';
      emoji = '🚀';
      commentary = '冷静，钢铁侠也需要睡觉 😴';
    } else if (score >= 70) {
      label = '贪婪';
      emoji = '😏';
      commentary = '市场过于乐观了，小心点';
    } else if (score <= 20) {
      label = '极度恐惧';
      emoji = '😱';
      commentary = '血流成河时，正是买入良机 🛒';
    } else if (score <= 40) {
      label = '恐惧';
      emoji = '😰';
      commentary = '也许是 DCA 的好时候？';
    }
    
    return {
      score,
      label,
      emoji,
      commentary,
      keywords: []
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticker } = body;

    if (!ticker) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_TICKER',
          message: '请输入股票代码或加密货币符号'
        }
      }, { status: 400 });
    }

    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: '请求太频繁了！休息 60 秒再试 ☕'
        }
      }, { status: 429 });
    }

    // Resolve ticker from input (handles company names like "UIPath" -> "PATH")
    const { ticker: resolvedTicker, companyName, hint } = resolveTickerFromInput(ticker);
    const normalizedTicker = resolvedTicker.toUpperCase().replace('$', '');

    // Check cache first
    const cachedData = getCachedData(normalizedTicker);
    if (cachedData) {
      return NextResponse.json({
        success: true,
        data: { ...cachedData, hint },
        cached: true
      });
    }

    // Fetch news and price in parallel
    const [headlines, priceData] = await Promise.all([
      getNewsFromYahoo(normalizedTicker, companyName || getCompanyName(normalizedTicker)),
      getCurrentPrice(normalizedTicker)
    ]);

    // Only return error if BOTH news and price are unavailable
    // Having news but no price, or price but no news is acceptable
    if (headlines.length === 0 && priceData.price === 0) {
      console.error(`Ticker not found: ${normalizedTicker}`);
      return NextResponse.json({
        success: false,
        error: {
          code: 'TICKER_NOT_FOUND',
          message: '找不到这个股票代码或加密货币，试试 AAPL, TSLA, BTC-USD 🤔'
        }
      }, { status: 404 });
    }

    // Log warnings if one of the data sources failed
    if (headlines.length === 0) {
      console.warn(`No news found for ${normalizedTicker}, but price data available`);
    }
    if (priceData.price === 0) {
      console.warn(`No price data for ${normalizedTicker}, but news available`);
    }

    // Analyze sentiment with OpenAI
    const sentiment = await analyzeSentiment(normalizedTicker, headlines);

    // Assign sentiment to each headline with improved keyword matching
    const headlinesWithSentiment = headlines.map(headline => {
      const title = headline.title.toLowerCase();
      let sentiment: 'bullish' | 'neutral' | 'bearish' = 'neutral';
      
      // Expanded keyword lists with weights
      const strongBullish = ['soar', 'surge', 'rocket', 'skyrocket', 'breakthrough', 'record high', 'all-time high', 'rally', 'boom', '暴涨', '飙升', '突破', '创新高'];
      const bullish = ['rise', 'gain', 'grow', 'up', 'bullish', 'positive', 'boost', 'upgrade', 'beat', 'outperform', 'strength', '上涨', '看涨', '增长', '利好'];
      
      const strongBearish = ['crash', 'plunge', 'collapse', 'tank', 'plummet', 'crisis', 'disaster', '崩盘', '暴跌', '危机'];
      const bearish = ['fall', 'drop', 'decline', 'down', 'bearish', 'negative', 'concern', 'worry', 'miss', 'underperform', 'weakness', 'cut', 'downgrade', '下跌', '看跌', '担忧', '利空'];
      
      // Score based approach
      let score = 0;
      
      strongBullish.forEach(word => {
        if (title.includes(word)) score += 2;
      });
      
      bullish.forEach(word => {
        if (title.includes(word)) score += 1;
      });
      
      strongBearish.forEach(word => {
        if (title.includes(word)) score -= 2;
      });
      
      bearish.forEach(word => {
        if (title.includes(word)) score -= 1;
      });
      
      // Determine sentiment based on score
      if (score >= 2) {
        sentiment = 'bullish';
      } else if (score <= -2) {
        sentiment = 'bearish';
      }
      // else remains neutral
      
      return { ...headline, sentiment };
    });

    const responseData = {
      ticker: normalizedTicker,
      companyName: companyName || getCompanyName(normalizedTicker),
      currentPrice: priceData.price,
      priceChange: priceData.change > 0 ? `+${priceData.change.toFixed(2)}%` : `${priceData.change.toFixed(2)}%`,
      sentiment,
      headlines: headlinesWithSentiment,
      timestamp: new Date().toISOString(),
      hint
    };

    // Cache the result
    setCachedData(normalizedTicker, responseData);

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('FOMO Meter API error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '服务器开小差了，请稍后再试 🔧'
      }
    }, { status: 500 });
  }
}

