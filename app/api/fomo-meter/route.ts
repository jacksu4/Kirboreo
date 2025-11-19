import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

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

async function getNewsFromYahoo(ticker: string): Promise<NewsItem[]> {
  try {
    console.log(`Fetching news for ${ticker}`);
    const searchResult = await yahooFinance.search(ticker, {
      newsCount: 15
    });

    const news = searchResult.news || [];
    console.log(`Found ${news.length} news items`);

    return news.slice(0, 10).map((item: any) => {
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

  const prompt = `分析以下关于 ${ticker} 的新闻标题，评估市场情绪。

新闻标题：
${headlinesText}

请返回一个 JSON 对象，格式如下：
{
  "score": 0-100,
  "label": "极度恐惧" | "恐惧" | "中性" | "贪婪" | "极度贪婪",
  "emoji": "😱" | "😰" | "😐" | "😏" | "🚀",
  "commentary": "一句话犀利点评（最多50字，要幽默讽刺）",
  "keywords": ["关键词1", "关键词2", "关键词3"]
}

评分标准：
- 90-100: 新闻全是"突破"、"暴涨"、"革命性"、"历史新高" → 极度贪婪 🚀
- 70-89: 正面新闻居多，市场乐观 → 贪婪 😏
- 40-69: 中性，正负面混合 → 中性 😐
- 20-39: 负面新闻较多，市场担忧 → 恐惧 😰
- 0-19: 新闻全是"暴跌"、"崩盘"、"危机"、"恐慌" → 极度恐惧 😱

点评要求：
- 要犀利、幽默、略带讽刺
- 如果是极度贪婪，提醒冷静，比如"树不会长到天上去"
- 如果是极度恐惧，鼓励抄底，比如"血流成河时正是买入良机"
- 最多50个字

只返回 JSON，不要其他内容。`;

  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt,
      temperature: 0.8,
    });

    console.log('OpenAI response:', text);

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    
    // Validate and ensure score is within bounds
    result.score = Math.max(0, Math.min(100, result.score || 50));
    
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

    const normalizedTicker = ticker.toUpperCase().replace('$', '');

    // Check cache first
    const cachedData = getCachedData(normalizedTicker);
    if (cachedData) {
      return NextResponse.json({
        success: true,
        data: cachedData,
        cached: true
      });
    }

    // Fetch news and price in parallel
    const [headlines, priceData] = await Promise.all([
      getNewsFromYahoo(normalizedTicker),
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
      currentPrice: priceData.price,
      priceChange: priceData.change > 0 ? `+${priceData.change.toFixed(2)}%` : `${priceData.change.toFixed(2)}%`,
      sentiment,
      headlines: headlinesWithSentiment,
      timestamp: new Date().toISOString()
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

