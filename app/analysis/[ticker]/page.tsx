import { client } from "@/sanity/lib/client";
import { STOCK_DETAIL_QUERY, POSTS_BY_CATEGORY_QUERY } from "@/sanity/lib/queries";
import { getStockData } from "@/lib/yahoo";
import StockAnalysis from "@/components/StockAnalysis";
import Navbar from "@/components/Navbar";

interface PageProps {
    params: Promise<{ ticker: string }>;
}

export const revalidate = 60;

export default async function StockPage({ params }: PageProps) {
    const { ticker } = await params;

    // Fetch stock details first to get company name
    const sanityData = await client.fetch(STOCK_DETAIL_QUERY, { ticker });

    if (!sanityData) {
        return (
            <main>
                <Navbar />
                <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
                    <h1>Stock Not Found in Database</h1>
                    <p>Please add {ticker} to Sanity first.</p>
                </div>
            </main>
        );
    }

    // Fetch market data and related posts in parallel
    const [yahooData, relatedPosts] = await Promise.all([
        getStockData(ticker),
        client.fetch(POSTS_BY_CATEGORY_QUERY, { ticker, companyName: sanityData.companyName })
    ]);

    if (!yahooData) {
        return (
            <main>
                <Navbar />
                <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
                    <h1>Market Data Unavailable</h1>
                    <p>Could not fetch live data for {ticker}.</p>
                </div>
            </main>
        );
    }

    // Merge data for the component
    const stockData = {
        ticker: sanityData.ticker,
        companyName: sanityData.companyName,
        currentPrice: yahooData.regularMarketPrice,
        priceChangePercentage: yahooData.regularMarketChangePercent,
        kirboreoScore: sanityData.kirboreoScore,
        scoreLabel: sanityData.scoreLabel,
        metrics: sanityData.metrics,
        priceHistory: yahooData.chart.map(item => ({
            date: item.date,
            close: item.close
        }))
    };

    return (
        <main>
            <Navbar />
            <div className="container" style={{ paddingTop: '120px' }}>
                <StockAnalysis stockData={stockData} relatedPosts={relatedPosts || []} />
            </div>
        </main>
    );
}
