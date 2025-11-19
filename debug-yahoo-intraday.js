const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function testIntraday() {
    const ticker = 'NVDA';
    const now = new Date();

    // Test 1D
    console.log('--- Testing 1D (15m) ---');
    try {
        const period1_1d = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 2 days ago
        const period2_1d = new Date().toISOString().split('T')[0];

        const queryOptions1d = {
            period1: period1_1d,
            period2: period2_1d,
            interval: '15m'
        };
        console.log('Options 1D:', queryOptions1d);
        const chart1d = await yahooFinance.historical(ticker, queryOptions1d);
        console.log('1D Result count:', chart1d.length);
        if (chart1d.length > 0) console.log('First 1D point:', chart1d[0]);
    } catch (error) {
        console.error('1D Error:', error.message);
        if (error.errors) console.error('Validation:', JSON.stringify(error.errors, null, 2));
    }

    // Test 5D
    console.log('\n--- Testing 5D (1h) ---');
    try {
        const period1_5d = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const period2_5d = new Date().toISOString().split('T')[0];

        const queryOptions5d = {
            period1: period1_5d,
            period2: period2_5d,
            interval: '1h'
        };
        console.log('Options 5D:', queryOptions5d);
        const chart5d = await yahooFinance.historical(ticker, queryOptions5d);
        console.log('5D Result count:', chart5d.length);
        if (chart5d.length > 0) console.log('First 5D point:', chart5d[0]);
    } catch (error) {
        console.error('5D Error:', error.message);
    }
}

testIntraday();
