import Navbar from "@/components/Navbar";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { STOCKS_LIST_QUERY } from "@/sanity/lib/queries";
import styles from "./AnalysisPage.module.css";

export const revalidate = 60;

interface StockSummary {
    ticker: string;
    companyName: string;
    kirboreoScore: number;
    scoreLabel: string;
}

export default async function AnalysisPage() {
    const stocks: StockSummary[] = await client.fetch(STOCKS_LIST_QUERY);

    return (
        <main>
            <Navbar />
            <div className="container" style={{ paddingTop: '120px' }}>
                <h1 className={styles.pageTitle}>Stock Analysis</h1>
                <p className={styles.pageSubtitle}>
                    Quantitative and qualitative analysis of top tech stocks.
                </p>

                <div className={styles.grid}>
                    {stocks.map((stock) => (
                        <Link href={`/analysis/${stock.ticker}`} key={stock.ticker} className={`glass-panel ${styles.card}`}>
                            <div className={styles.cardHeader}>
                                <span className={styles.ticker}>{stock.ticker}</span>
                                <div className={styles.scoreBadge}>
                                    <span className={styles.score}>{stock.kirboreoScore}</span>
                                </div>
                            </div>
                            <h3 className={styles.companyName}>{stock.companyName}</h3>
                            <div className={styles.labelContainer}>
                                <span className={`${styles.label} ${styles[stock.scoreLabel.toLowerCase()]}`}>
                                    {stock.scoreLabel}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
