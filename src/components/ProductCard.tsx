import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { EnhancedProduct } from '../utils/productHelper';
import { StarRating } from './StarRating';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: EnhancedProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  const availableVariant = product.variants.find((v) => v.stock > 0);
  const isSoldOut = !availableVariant;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (availableVariant) {
      addItem({
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        image: product.image,
        color: availableVariant.color,
        size: availableVariant.size,
        maxStock: availableVariant.stock
      });
    }
  };

  return (
    <div className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.imageLink}>
        {product.isOnSale && <span className={styles.saleBadge}>Sale</span>}
        <div className={styles.imageWrapper}>
          <img src={product.image} alt={product.title} className={styles.image} />
        </div>
      </Link>

      <div className={styles.content}>
        <span className={styles.brand}>{product.brand}</span>

        <Link to={`/product/${product.id}`} className={styles.titleLink}>
          <h3 className={styles.title} title={product.title}>
            {product.title}
          </h3>
        </Link>

        <div className={styles.ratingRow}>
          <StarRating rate={product.rating.rate} count={product.rating.count} showText={false} />
          <span className={styles.ratingNum}>{product.rating.rate.toFixed(1)}</span>
        </div>

        <div className={styles.footerRow}>
          <div className={styles.priceContainer}>
            {product.isOnSale ? (
              <>
                <span className={styles.salePrice}>${product.price.toFixed(2)}</span>
                <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className={styles.price}>${product.price.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isSoldOut}
            className={`${styles.addBtn} ${isSoldOut ? styles.soldOut : ''}`}
            aria-label={isSoldOut ? 'Sold Out' : 'Quick Add to Cart'}
          >
            {isSoldOut ? (
              'Sold Out'
            ) : (
              <>
                <span className={styles.btnText}>Quick Add</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.btnIcon}>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
