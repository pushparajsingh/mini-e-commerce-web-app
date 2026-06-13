import React from 'react';
import styles from './SkeletonLoader.module.scss';

interface SkeletonLoaderProps {
  type: 'card' | 'detail';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, count = 1 }) => {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className={styles.grid}>
        {items.map((_, idx) => (
          <div key={idx} className={styles.card}>
            <div className={`${styles.shimmer} ${styles.image}`} />
            <div className={styles.content}>
              <div className={`${styles.shimmer} ${styles.brand}`} />
              <div className={`${styles.shimmer} ${styles.title}`} />
              <div className={`${styles.shimmer} ${styles.price}`} />
              <div className={`${styles.shimmer} ${styles.button}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Detail Page Skeleton
  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailLeft}>
        <div className={`${styles.shimmer} ${styles.mainImage}`} />
        <div className={styles.thumbnails}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className={`${styles.shimmer} ${styles.thumbnail}`} />
          ))}
        </div>
      </div>
      <div className={styles.detailRight}>
        <div className={`${styles.shimmer} ${styles.detailBrand}`} />
        <div className={`${styles.shimmer} ${styles.detailTitle}`} />
        <div className={`${styles.shimmer} ${styles.detailRating}`} />
        <div className={`${styles.shimmer} ${styles.detailPrice}`} />
        <div className={`${styles.shimmer} ${styles.detailDesc}`} />
        <div className={`${styles.shimmer} ${styles.detailSwatches}`} />
        <div className={`${styles.shimmer} ${styles.detailSizes}`} />
        <div className={`${styles.shimmer} ${styles.detailActions}`} />
      </div>
    </div>
  );
};
