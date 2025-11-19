/**
 * Common company name to ticker symbol mappings
 * This helps users who input company names instead of ticker symbols
 */

export interface TickerMapping {
  ticker: string;
  name: string;
  aliases: string[]; // Common variations
}

export const TICKER_MAPPINGS: TickerMapping[] = [
  {
    ticker: 'PATH',
    name: 'UiPath',
    aliases: ['uipath', 'ui path', 'uipath inc']
  },
  {
    ticker: 'CRCL',
    name: 'Circle',
    aliases: ['circle', 'circle internet financial']
  },
  {
    ticker: 'COIN',
    name: 'Coinbase',
    aliases: ['coinbase', 'coinbase global']
  },
  {
    ticker: 'TSLA',
    name: 'Tesla',
    aliases: ['tesla', 'tesla motors', 'tesla inc']
  },
  {
    ticker: 'AAPL',
    name: 'Apple',
    aliases: ['apple', 'apple inc', 'apple computer']
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA',
    aliases: ['nvidia', 'nvidia corp', 'nvidia corporation']
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft',
    aliases: ['microsoft', 'microsoft corp', 'microsoft corporation']
  },
  {
    ticker: 'GOOGL',
    name: 'Google',
    aliases: ['google', 'alphabet', 'alphabet inc']
  },
  {
    ticker: 'AMZN',
    name: 'Amazon',
    aliases: ['amazon', 'amazon.com', 'amazon inc']
  },
  {
    ticker: 'META',
    name: 'Meta',
    aliases: ['meta', 'facebook', 'meta platforms']
  }
];

/**
 * Resolves a user input to a ticker symbol
 * @param input - User input (ticker or company name)
 * @returns Ticker symbol if found, or original input if not
 */
export function resolveTickerFromInput(input: string): { ticker: string; companyName?: string; hint?: string } {
  const normalized = input.toLowerCase().trim();
  
  // Check if input is already a known ticker
  const directMatch = TICKER_MAPPINGS.find(m => m.ticker.toLowerCase() === normalized);
  if (directMatch) {
    return { ticker: directMatch.ticker, companyName: directMatch.name };
  }
  
  // Check if input matches any aliases
  const aliasMatch = TICKER_MAPPINGS.find(m => 
    m.aliases.some(alias => alias === normalized)
  );
  if (aliasMatch) {
    return { 
      ticker: aliasMatch.ticker, 
      companyName: aliasMatch.name,
      hint: `Resolved "${input}" to ${aliasMatch.ticker} (${aliasMatch.name})`
    };
  }
  
  // No match found - return original input (might be a valid ticker we don't know about)
  return { ticker: input.toUpperCase() };
}

/**
 * Gets the company name for a given ticker
 * @param ticker - Stock ticker symbol
 * @returns Company name if known, undefined otherwise
 */
export function getCompanyName(ticker: string): string | undefined {
  const match = TICKER_MAPPINGS.find(m => m.ticker.toUpperCase() === ticker.toUpperCase());
  return match?.name;
}

