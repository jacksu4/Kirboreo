import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export interface StockData {
    symbol: string;
    shortName: string;
    regularMarketPrice: number;
    regularMarketChangePercent: number;
    currency: string;
    chart: {
        date: string;
        close: number;
    }[];
}

export type TimeRange = '1d' | '5d' | '1mo' | '6mo' | 'ytd' | '1y' | '5y';

export async function getStockChart(ticker: string, range: TimeRange) {
    const queryOptions: any = { period1: '2024-01-01' }; // Default
    const now = new Date();

    switch (range) {
        case '1d':
            queryOptions.period1 = new Date(now.setDate(now.getDate() - 2)).toISOString().split('T')[0]; // Go back a bit to ensure data
            queryOptions.period2 = new Date().toISOString().split('T')[0]; // Today (next day for safety)
            queryOptions.interval = '15m'; // Intraday
            break;
        case '5d':
            queryOptions.period1 = new Date(now.setDate(now.getDate() - 5)).toISOString().split('T')[0];
            queryOptions.period2 = new Date().toISOString().split('T')[0];
            queryOptions.interval = '1h';
            break;
        case '1mo':
            queryOptions.period1 = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
            queryOptions.period2 = new Date().toISOString().split('T')[0];
            queryOptions.interval = '1d';
            break;
        case '6mo':
            queryOptions.period1 = new Date(now.setMonth(now.getMonth() - 6)).toISOString().split('T')[0];
            queryOptions.period2 = new Date().toISOString().split('T')[0];
            queryOptions.interval = '1d';
            break;
        case 'ytd':
            queryOptions.period1 = `${new Date().getFullYear()}-01-01`;
            queryOptions.period2 = new Date().toISOString().split('T')[0];
            queryOptions.interval = '1d';
            break;
        case '1y':
            queryOptions.period1 = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0];
            queryOptions.period2 = new Date().toISOString().split('T')[0];
            queryOptions.interval = '1d';
            break;
        case '5y':
            queryOptions.period1 = new Date(now.setFullYear(now.getFullYear() - 5)).toISOString().split('T')[0];
            queryOptions.period2 = new Date().toISOString().split('T')[0];
            queryOptions.interval = '1wk';
            break;
    }

    // For 1d/5d, we might need to be careful with weekends/holidays, but let's try this first.
    // Yahoo often handles "period1" intelligently if we just ask for a range, but the library needs specific dates usually.
    // Actually, yahoo-finance2 queryOptions can take `period1` as a date string.

    try {
        // Use chart() for intraday data (1d, 5d) or if historical fails
        if (range === '1d' || range === '5d') {
            const chartResult = await yahooFinance.chart(ticker, queryOptions);
            if (chartResult && chartResult.quotes) {
                return (chartResult.quotes as any[])
                    .filter((q: any) => q.close) // Filter out nulls
                    .map((item: any) => ({
                        date: item.date.toISOString(),
                        close: item.close,
                    }));
            }
        }

        // Fallback to historical for longer ranges
        const chartData = await yahooFinance.historical(ticker, queryOptions) as any[];
        return chartData.map((item: any) => ({
            date: item.date.toISOString(),
            close: item.close,
        }));
    } catch (error) {
        console.error(`Error fetching chart for ${ticker} ${range}:`, error);
        return [];
    }
}

export async function getStockData(ticker: string): Promise<StockData | null> {
    try {
        const quote = await yahooFinance.quote(ticker) as any;
        const chart = await getStockChart(ticker, '1y'); // Default to 1y

        if (!quote) return null;

        return {
            symbol: quote.symbol,
            shortName: quote.shortName || ticker,
            regularMarketPrice: quote.regularMarketPrice || 0,
            regularMarketChangePercent: quote.regularMarketChangePercent || 0,
            currency: quote.currency || 'USD',
            chart: chart,
        };
    } catch (error) {
        console.error(`Error fetching data for ${ticker}:`, error);
        return null;
    }
}
