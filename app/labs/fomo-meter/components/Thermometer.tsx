'use client';

import styles from './Thermometer.module.css';

interface ThermometerProps {
  score: number; // 0-100
  label: string;
  emoji: string;
}

function getColorByScore(score: number): string {
  if (score >= 90) return '#ff6b6b'; // Extreme Greed - Red
  if (score >= 70) return '#ff8e53'; // Greed - Orange
  if (score >= 40) return '#6c757d'; // Neutral - Gray
  if (score >= 20) return '#4a5568'; // Fear - Dark Gray
  return '#2d3748'; // Extreme Fear - Dark Purple
}

export default function Thermometer({ score, label, emoji }: ThermometerProps) {
  const color = getColorByScore(score);
  const percentage = score;
  const mercuryHeight = (percentage / 100) * 320; // 320 is the height of thermometer

  return (
    <div className={styles.thermometerContainer}>
      <div className={styles.labelTop}>
        <span className={styles.emojiLarge}>{emoji}</span>
        <div className={styles.scoreText}>
          <span className={styles.scoreNumber}>{score}</span>
          <span className={styles.scoreMax}>/100</span>
        </div>
      </div>

      <svg
        viewBox="0 0 120 400"
        className={styles.thermometer}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Thermometer outer tube */}
        <rect
          x="40"
          y="30"
          width="40"
          height="320"
          rx="20"
          fill="rgba(255, 255, 255, 0.05)"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
        />

        {/* Scale marks */}
        <line x1="80" y1="30" x2="90" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <text x="95" y="35" fill="rgba(255,255,255,0.5)" fontSize="10">100</text>

        <line x1="80" y1="190" x2="90" y2="190" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <text x="95" y="195" fill="rgba(255,255,255,0.5)" fontSize="10">50</text>

        <line x1="80" y1="350" x2="90" y2="350" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <text x="95" y="355" fill="rgba(255,255,255,0.5)" fontSize="10">0</text>

        {/* Mercury (filled part) */}
        <rect
          x="42"
          y={350 - mercuryHeight}
          width="36"
          height={mercuryHeight}
          rx="18"
          fill={color}
          className={styles.mercury}
        >
          <animate
            attributeName="height"
            from="0"
            to={mercuryHeight}
            dur="1.5s"
            fill="freeze"
          />
          <animate
            attributeName="y"
            from="350"
            to={350 - mercuryHeight}
            dur="1.5s"
            fill="freeze"
          />
        </rect>

        {/* Thermometer bulb at bottom */}
        <circle
          cx="60"
          cy="365"
          r="15"
          fill={color}
          className={styles.bulb}
        />
      </svg>

      <div className={styles.labelBottom}>
        <span className={styles.labelText}>{label}</span>
      </div>
    </div>
  );
}

