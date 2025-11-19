const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();



async function testFetch() {
    const ticker = 'NVDA';
    console.log(`Fetching data for ${ticker}...`);

    try {
        const quote = await yahooFinance.quote(ticker);
        console.log('Quote success:', quote.symbol, quote.regularMarketPrice);
    } catch (error) {
        console.error('Quote Error:', error.message);
    }

    try {
        // Try with period2 (now)
        const queryOptions = {
            period1: '2024-01-01',
            period2: new Date().toISOString().split('T')[0], // Today
            interval: '1d'
        };
        console.log('Testing options:', queryOptions);
        const chart = await yahooFinance.historical(ticker, queryOptions);
        console.log('Chart success, data points:', chart.length);
    } catch (error) {
        console.error('Chart Error:', error.message);
        if (error.errors) console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
    }
}

testFetch();
