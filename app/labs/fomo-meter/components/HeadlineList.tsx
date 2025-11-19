'use client';

import styles from './HeadlineList.module.css';

interface Headline {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  sentiment?: 'bullish' | 'neutral' | 'bearish';
}

interface HeadlineListProps {
  headlines: Headline[];
}

function getSentimentEmoji(sentiment?: string): string {
  if (sentiment === 'bullish') return '🔴';
  if (sentiment === 'bearish') return '🟢';
  return '🟡';
}

function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} 分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours} 小时前`;
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays} 天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  } catch (error) {
    return '最近';
  }
}

export default function HeadlineList({ headlines }: HeadlineListProps) {
  if (!headlines || headlines.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyEmoji}>📰</span>
        <p>没有找到相关新闻</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        <span className={styles.titleIcon}>📰</span>
        分析的新闻 ({headlines.length} 条)
      </h3>

      <div className={styles.headlinesList}>
        {headlines.map((headline, index) => (
          <a
            key={index}
            href={headline.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.headlineCard}
          >
            <div className={styles.headlineHeader}>
              <span className={styles.sentimentIndicator}>
                {getSentimentEmoji(headline.sentiment)}
              </span>
              <h4 className={styles.headlineTitle}>{headline.title}</h4>
            </div>
            <div className={styles.headlineMeta}>
              <span className={styles.source}>{headline.source}</span>
              <span className={styles.divider}>·</span>
              <span className={styles.timestamp}>
                {formatTimestamp(headline.publishedAt)}
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span>🔴</span>
          <span>看涨新闻</span>
        </div>
        <div className={styles.legendItem}>
          <span>🟡</span>
          <span>中性新闻</span>
        </div>
        <div className={styles.legendItem}>
          <span>🟢</span>
          <span>看跌新闻</span>
        </div>
      </div>
    </div>
  );
}

