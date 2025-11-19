'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { fetchStockChart } from '@/app/actions/stock';
import styles from './StockAnalysis.module.css';

interface StockData {
    ticker: string;
    companyName: string;
    currentPrice: number;
    priceChangePercentage: number;
    kirboreoScore: number;
    scoreLabel: string;
    metrics: {
        growth: number;
        value: number;
        momentum: number;
    };
    priceHistory: {
        date: string;
        close: number;
    }[];
}

interface Post {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    publishedAt: string;
    categories: string[];
}

interface StockAnalysisProps {
    stockData: StockData;
    relatedPosts: Post[];
}

const RANGES = ['1d', '5d', '1mo', '6mo', 'ytd', '1y', '5y'];

export default function StockAnalysis({ stockData, relatedPosts }: StockAnalysisProps) {
    const [range, setRange] = useState('1y');
    const [chartData, setChartData] = useState(stockData.priceHistory);
    const [loading, setLoading] = useState(false);
    const [displayChange, setDisplayChange] = useState(stockData.priceChangePercentage);
    const [changeLabel, setChangeLabel] = useState('Today');

    useEffect(() => {
        if (range === '1d') {
            setDisplayChange(stockData.priceChangePercentage);
            setChangeLabel('Today');
        } else if (chartData && chartData.length > 0) {
            const firstPrice = chartData[0].close;
            const lastPrice = chartData[chartData.length - 1].close;
            const change = ((lastPrice - firstPrice) / firstPrice) * 100;
            setDisplayChange(change);
            setChangeLabel(range.toUpperCase());
        }
    }, [chartData, range, stockData.priceChangePercentage]);

    const handleRangeChange = async (newRange: string) => {
        setRange(newRange);
        setLoading(true);
        try {
            const data = await fetchStockChart(stockData.ticker, newRange as any);
            setChartData(data);
        } catch (error) {
            console.error('Failed to fetch chart data', error);
        } finally {
            setLoading(false);
        }
    };

    const formatXAxis = (tickItem: string) => {
        const date = new Date(tickItem);
        if (range === '1d' || range === '5d') {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    if (!stockData) {
        return <div className={styles.container}>Loading analysis...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.ticker}>{stockData.ticker}</h1>
                    <p className={styles.companyName}>{stockData.companyName}</p>
                </div>
                <div className={styles.priceBlock}>
                    <span className={styles.price}>${stockData.currentPrice.toFixed(2)}</span>
                    <span className={`${styles.change} ${displayChange >= 0 ? styles.positive : styles.negative}`}>
                        {displayChange > 0 ? '+' : ''}{displayChange.toFixed(2)}%
                        <span className={styles.changeLabel}> ({changeLabel})</span>
                    </span>
                </div>
            </div>


            {/* Price Performance - Full Width */}
            <div className={`glass-panel ${styles.chartCard}`}>
                <div className={styles.chartHeader}>
                    <h3 className={styles.cardTitle}>Price Performance</h3>
                    <div className={styles.rangeSelector}>
                        {RANGES.map((r) => (
                            <button
                                key={r}
                                className={`${styles.rangeBtn} ${range === r ? styles.activeRange : ''}`}
                                onClick={() => handleRangeChange(r)}
                                disabled={loading}
                            >
                                {r.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.chartContainer}>
                    {loading ? (
                        <div className={styles.loadingOverlay}>Loading...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF6EC7" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#FF6EC7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="rgba(255,255,255,0.5)"
                                    tickFormatter={formatXAxis}
                                    minTickGap={30}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.5)"
                                    domain={['auto', 'auto']}
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(val) => `$${val}`}
                                />
                                <Tooltip
                                    contentStyle={{ background: '#0F1623', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: 'rgba(255,255,255,0.7)', marginBottom: '5px' }}
                                    labelFormatter={(label) => new Date(label).toLocaleString()}
                                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="close"
                                    stroke="#FF6EC7"
                                    fillOpacity={1}
                                    fill="url(#colorPrice)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Kirboreo Score - Full Width */}
            <div className={`glass-panel ${styles.scoreCard}`}>
                <h3 className={styles.cardTitle}>Kirboreo Score</h3>
                <div className={styles.scoreContainer}>
                    <div className={styles.scoreCircle}>
                        <span className={styles.scoreValue}>{stockData.kirboreoScore}</span>
                        <span className={styles.scoreLabel}>{stockData.scoreLabel}</span>
                    </div>
                    <div className={styles.metrics}>
                        <div className={styles.metric}>
                            <div className={styles.metricHeader}>
                                <span>Growth</span>
                                <span className={styles.metricValue}>{stockData.metrics.growth}/100</span>
                            </div>
                            <div className={styles.bar}><div className={styles.fill} style={{ width: `${stockData.metrics.growth}%` }}></div></div>
                        </div>
                        <div className={styles.metric}>
                            <div className={styles.metricHeader}>
                                <span>Value</span>
                                <span className={styles.metricValue}>{stockData.metrics.value}/100</span>
                            </div>
                            <div className={styles.bar}><div className={styles.fill} style={{ width: `${stockData.metrics.value}%` }}></div></div>
                        </div>
                        <div className={styles.metric}>
                            <div className={styles.metricHeader}>
                                <span>Momentum</span>
                                <span className={styles.metricValue}>{stockData.metrics.momentum}/100</span>
                            </div>
                            <div className={styles.bar}><div className={styles.fill} style={{ width: `${stockData.metrics.momentum}%` }}></div></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analysis Section - Always Display */}
            <div className={`glass-panel ${styles.analysisSection}`}>
                <h3 className={styles.cardTitle}>Analysis</h3>
                {relatedPosts && relatedPosts.length > 0 ? (
                    <div className={styles.articlesGrid}>
                        {relatedPosts.map((post) => (
                            <Link href={`/research/${post.slug}`} key={post._id} className={styles.articleCard}>
                                <div className={styles.articleHeader}>
                                    <div className={styles.articleCategories}>
                                        {post.categories?.map(cat => (
                                            <span key={cat} className={styles.categoryTag}>{cat}</span>
                                        ))}
                                    </div>
                                    <span className={styles.articleDate}>
                                        {new Date(post.publishedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className={styles.articleTitle}>{post.title}</h4>
                                {post.summary && <p className={styles.articleSummary}>{post.summary}</p>}
                                <div className={styles.readMore}>
                                    Read Article →
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyStateText}>暂无相关分析文章</p>
                        <p className={styles.emptyStateSubtext}>我们会持续为您带来关于 {stockData.companyName} 的深度分析</p>
                    </div>
                )}
            </div>
        </div>
    );
}
