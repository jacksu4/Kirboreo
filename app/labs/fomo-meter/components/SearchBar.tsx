'use client';

import { useState, FormEvent } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (ticker: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled }: SearchBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ticker = input.trim().toUpperCase().replace('$', '');
    if (ticker) {
      onSearch(ticker);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入股票代码或加密货币... (例如 TSLA, BTC-USD)"
          className={styles.searchInput}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className={styles.searchButton}
        >
          <span className={styles.buttonIcon}>🔍</span>
          <span>分析情绪</span>
        </button>
      </div>
    </form>
  );
}

