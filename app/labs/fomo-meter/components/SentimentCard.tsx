'use client';

import Thermometer from './Thermometer';
import styles from './SentimentCard.module.css';

interface SentimentCardProps {
  data: {
    ticker: string;
    companyName?: string;
    currentPrice: number;
    priceChange: string;
    sentiment: {
      score: number;
      label: string;
      emoji: string;
      commentary: string;
      keywords: string[];
    };
    hint?: string;
  };
}

export default function SentimentCard({ data }: SentimentCardProps) {
  const { ticker, companyName, currentPrice, priceChange, sentiment, hint } = data;
  const isPositive = priceChange.startsWith('+');

  return (
    <div className={styles.card}>
      {hint && (
        <div className={styles.hintBanner}>
          ℹ️ {hint}
        </div>
      )}
      <div className={styles.header}>
        <div className={styles.tickerInfo}>
          <h2 className={styles.ticker}>
            {ticker}
            {companyName && <span className={styles.companyName}>({companyName})</span>}
          </h2>
          <div className={styles.priceInfo}>
            <span className={styles.price}>
              ${currentPrice > 0 ? currentPrice.toFixed(2) : 'N/A'}
            </span>
            {currentPrice > 0 && (
              <span className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
                {priceChange}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.thermometerSection}>
          <Thermometer
            score={sentiment.score}
            label={sentiment.label}
            emoji={sentiment.emoji}
          />
        </div>

        <div className={styles.analysisSection}>
          <div className={styles.commentaryBox}>
            <span className={styles.commentaryEmoji}>💬</span>
            <p className={styles.commentary}>{sentiment.commentary}</p>
          </div>

          {sentiment.keywords && sentiment.keywords.length > 0 && (
            <div className={styles.keywordsSection}>
              <h4 className={styles.keywordsTitle}>关键词</h4>
              <div className={styles.keywords}>
                {sentiment.keywords.map((keyword, index) => (
                  <span key={index} className={styles.keyword}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.interpretationBox}>
            <h4 className={styles.interpretationTitle}>如何理解？</h4>
            <p className={styles.interpretation}>
              {sentiment.score >= 80 && (
                <>
                  <strong>极度贪婪：</strong>市场情绪过热，所有人都在谈论这个股票。
                  作为反向指标，这可能是冷静观察、避免追高的时候。记住：树不会长到天上去 🌳
                </>
              )}
              {sentiment.score >= 60 && sentiment.score < 80 && (
                <>
                  <strong>贪婪：</strong>市场乐观，正面新闻居多。
                  情绪偏向积极，但还算理性。可以关注，但不要盲目跟风。
                </>
              )}
              {sentiment.score >= 40 && sentiment.score < 60 && (
                <>
                  <strong>中性：</strong>市场情绪平衡，正负面新闻混合。
                  这是相对理性的状态，适合冷静分析基本面。
                </>
              )}
              {sentiment.score >= 20 && sentiment.score < 40 && (
                <>
                  <strong>恐惧：</strong>市场担忧，负面新闻较多。
                  如果基本面没有实质性恶化，这可能是关注机会的时候。
                </>
              )}
              {sentiment.score < 20 && (
                <>
                  <strong>极度恐惧：</strong>市场恐慌，所有人都在抛售。
                  血流成河时，往往是财富转移的时刻。巴菲特说：别人恐惧我贪婪 💎
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

