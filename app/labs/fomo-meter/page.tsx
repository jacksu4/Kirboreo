'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SearchBar from './components/SearchBar';
import SentimentCard from './components/SentimentCard';
import HeadlineList from './components/HeadlineList';
import styles from './fomo-meter.module.css';

export default function FOMOMeterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (ticker: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/fomo-meter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error.message);
        return;
      }

      setResult(data.data);
    } catch (err) {
      console.error('Search error:', err);
      setError('网络错误，请检查连接后重试 🌐');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                <span className={styles.emoji}>😱</span>
                FOMO Meter
                <span className={styles.emoji}>🚀</span>
              </h1>
              <p className={styles.heroSubtitle}>
                了解市场在疯狂还是恐慌
              </p>
              <p className={styles.heroDescription}>
                基于最新新闻和 AI 分析，实时展示市场情绪温度
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className={styles.searchSection}>
          <div className="container">
            <SearchBar onSearch={handleSearch} disabled={loading} />
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <section className={styles.loadingSection}>
            <div className="container">
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>正在分析市场情绪... 🔍</p>
              </div>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && !loading && (
          <section className={styles.errorSection}>
            <div className="container">
              <div className={styles.errorCard}>
                <span className={styles.errorEmoji}>😕</span>
                <p>{error}</p>
                <button onClick={handleReset} className={styles.retryButton}>
                  再试一次
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Results Section */}
        {result && !loading && (
          <>
            <section className={styles.resultsSection}>
              <div className="container">
                <SentimentCard data={result} />
              </div>
            </section>

            <section className={styles.headlinesSection}>
              <div className="container">
                <HeadlineList headlines={result.headlines} />
              </div>
            </section>

            <section className={styles.actionsSection}>
              <div className="container">
                <button onClick={handleReset} className={styles.tryAnotherButton}>
                  分析另一个股票
                </button>
              </div>
            </section>
          </>
        )}

        {/* Info Section (when no results) */}
        {!result && !loading && !error && (
          <section className={styles.infoSection}>
            <div className="container">
              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <span className={styles.infoEmoji}>📊</span>
                  <h3>实时分析</h3>
                  <p>基于最新 10 条新闻，AI 实时评估市场情绪</p>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoEmoji}>🎯</span>
                  <h3>反向指标</h3>
                  <p>当市场极度贪婪时提醒你冷静，恐慌时提醒你机会</p>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoEmoji}>🚀</span>
                  <h3>支持多种资产</h3>
                  <p>股票（TSLA, AAPL）和加密货币（BTC-USD, ETH-USD）</p>
                </div>
              </div>

              <div className={styles.examplesSection}>
                <h3>试试这些：</h3>
                <div className={styles.exampleTags}>
                  <button onClick={() => handleSearch('TSLA')} className={styles.exampleTag}>
                    TSLA
                  </button>
                  <button onClick={() => handleSearch('AAPL')} className={styles.exampleTag}>
                    AAPL
                  </button>
                  <button onClick={() => handleSearch('NVDA')} className={styles.exampleTag}>
                    NVDA
                  </button>
                  <button onClick={() => handleSearch('BTC-USD')} className={styles.exampleTag}>
                    BTC-USD
                  </button>
                  <button onClick={() => handleSearch('ETH-USD')} className={styles.exampleTag}>
                    ETH-USD
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Background Effects */}
      <div className={styles.backgroundEffects}>
        <div className={styles.glow1} />
        <div className={styles.glow2} />
      </div>
    </div>
  );
}

