import React from 'react';
import styles from './StarRating.module.scss';

interface StarRatingProps {
  rate: number;
  count?: number;
  showText?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ rate, count, showText = true }) => {
  const fullStars = Math.floor(rate);
  const hasHalfStar = rate % 1 >= 0.25 && rate % 1 < 0.75;
  const isCloseToNext = rate % 1 >= 0.75;
  const starsArray = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars || (i === fullStars + 1 && isCloseToNext)) {
      starsArray.push('full');
    } else if (i === fullStars + 1 && hasHalfStar) {
      starsArray.push('half');
    } else {
      starsArray.push('empty');
    }
  }

  return (
    <div className={styles.ratingContainer}>
      <div className={styles.stars}>
        {starsArray.map((type, idx) => (
          <span key={idx} className={styles.starWrapper}>
            {type === 'full' && (
              <svg className={styles.starFull} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            )}
            {type === 'half' && (
              <svg className={styles.starHalf} viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="halfGrad">
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="transparent" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  fill="url(#halfGrad)"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            )}
            {type === 'empty' && (
              <svg className={styles.starEmpty} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            )}
          </span>
        ))}
      </div>
      {showText && (
        <span className={styles.ratingText}>
          <strong>{rate.toFixed(1)}</strong>
          {count !== undefined && <span className={styles.count}>({count} reviews)</span>}
        </span>
      )}
    </div>
  );
};
