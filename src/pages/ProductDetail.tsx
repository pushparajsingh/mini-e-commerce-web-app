/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { enhanceProduct } from '../utils/productHelper';
import type { EnhancedProduct, Variant, RawProduct } from '../utils/productHelper';
import { useCart } from '../context/CartContext';
import { StarRating } from '../components/StarRating';
import { SkeletonLoader } from '../components/SkeletonLoader';
import styles from './ProductDetail.module.scss';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState<EnhancedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<RawProduct>(`https://fakestoreapi.com/products/${id}`);
        if (!response.data) {
          setError('Product not found.');
          return;
        }
        const enhanced = enhanceProduct(response.data);
        setProduct(enhanced);
        setActiveImageIdx(0);
      } catch {
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  useEffect(() => {
    if (!product) return;

    const colorParam = searchParams.get('color');
    const sizeParam = searchParams.get('size');

    const hasValidColor = product.colors.some((c) => c.name === colorParam);
    const hasValidSize = product.sizes.includes(sizeParam || '');

    if (hasValidColor && hasValidSize) {
      setSelectedColor(colorParam!);
      setSelectedSize(sizeParam!);
    } else {
      const inStockVariant = product.variants.find((v) => v.stock > 0);
      const defaultVariant = inStockVariant || product.variants[0];

      if (defaultVariant) {
        setSelectedColor(defaultVariant.color);
        setSelectedSize(defaultVariant.size);
        setSearchParams(
          { color: defaultVariant.color, size: defaultVariant.size },
          { replace: true }
        );
      }
    }
  }, [product, searchParams, setSearchParams]);

  const activeVariant = useMemo<Variant | undefined>(() => {
    if (!product || !selectedColor || !selectedSize) return undefined;
    return product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  }, [product, selectedColor, selectedSize]);

  const handleVariantChange = (color: string, size: string) => {
    setSelectedColor(color);
    setSelectedSize(size);
    setQuantity(1);
    setSearchParams({ color, size }, { replace: true });
  };

  const maxStock = activeVariant?.stock || 0;
  const isSoldOut = maxStock === 0;

  const incrementQty = () => {
    setQuantity((prev) => Math.min(prev + 1, maxStock));
  };

  const decrementQty = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    if (quantity > maxStock && maxStock > 0) {
      setQuantity(maxStock);
    } else if (isSoldOut) {
      setQuantity(1);
    }
  }, [maxStock, isSoldOut, quantity]);

  const handleAddToCart = () => {
    if (!product || isSoldOut || !activeVariant) return;

    addItem({
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      image: product.image,
      color: selectedColor,
      size: selectedSize,
      quantity,
      maxStock: activeVariant.stock
    });
  };

  const getPreviewImageStyle = (imageUrl: string) => {
    if (imageUrl.endsWith('#zoom')) return styles.previewZoom;
    if (imageUrl.endsWith('#tilt')) return styles.previewTilt;
    if (imageUrl.endsWith('#detail')) return styles.previewDetail;
    return '';
  };

  const getThumbnailImageStyle = (imageUrl: string) => {
    if (imageUrl.endsWith('#zoom')) return styles.thumbZoom;
    if (imageUrl.endsWith('#tilt')) return styles.thumbTilt;
    if (imageUrl.endsWith('#detail')) return styles.thumbDetail;
    return '';
  };

  if (loading) {
    return (
      <main className="container" style={{ padding: '40px 24px' }}>
        <SkeletonLoader type="detail" />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className={`${styles.errorState} container animate-fade-in`}>
        <div className={styles.errorIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2>Product details unavailable</h2>
        <p>{error || 'Could not load the specified product.'}</p>
        <Link to="/" className={styles.backHomeBtn}>
          Back to Storefront
        </Link>
      </main>
    );
  }

  return (
    <main className="container animate-fade-in">
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/" className={styles.breadcrumbLink}>Home</Link>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.separator}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className={styles.breadcrumbCategory}>
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.separator}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className={styles.breadcrumbCurrent} title={product.title}>
          {product.title}
        </span>
      </nav>

      <section className={styles.productContainer}>
        <div className={styles.galleryContainer}>
          <div className={styles.mainImageContainer}>
            <img
              src={product.images[activeImageIdx]}
              alt={product.title}
              className={`${styles.mainImage} ${getPreviewImageStyle(product.images[activeImageIdx])}`}
            />
            {product.isOnSale && <span className={styles.saleBadge}>Sale</span>}
          </div>
          
          <div className={styles.thumbnailDeck}>
            {product.images.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIdx(index)}
                className={`${styles.thumbnailCard} ${activeImageIdx === index ? styles.activeThumbnail : ''}`}
                aria-label={`View product image ${index + 1}`}
              >
                <div className={styles.thumbnailWrapper}>
                  <img
                    src={imgUrl}
                    alt=""
                    className={`${styles.thumbnailImg} ${getThumbnailImageStyle(imgUrl)}`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.detailsContainer}>
          <div className={styles.brandRow}>
            <span className={styles.brandName}>{product.brand}</span>
            <span className={styles.categoryBadge}>{product.category}</span>
          </div>

          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.ratingRow}>
            <StarRating rate={product.rating.rate} count={product.rating.count} />
          </div>

          <div className={styles.priceContainer}>
            {product.isOnSale ? (
              <div className={styles.priceRow}>
                <span className={styles.salePrice}>${product.price.toFixed(2)}</span>
                <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
                <span className={styles.discountBadge}>
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              </div>
            ) : (
              <span className={styles.price}>${product.price.toFixed(2)}</span>
            )}
          </div>

          <div className={styles.divider} />

          <p className={styles.description}>{product.description}</p>

          <div className={styles.divider} />

          <div className={styles.selectorGroup}>
            <div className={styles.selectorHeader}>
              <span className={styles.selectorLabel}>Color:</span>
              <strong className={styles.selectedVal}>{selectedColor}</strong>
            </div>
            <div className={styles.colorSwatches}>
              {product.colors.map((color) => {
                const isSelected = selectedColor === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={() => handleVariantChange(color.name, selectedSize)}
                    className={`${styles.swatchBtn} ${isSelected ? styles.selectedSwatch : ''}`}
                    style={{ '--swatch-color': color.hex } as React.CSSProperties}
                    aria-label={`Select color ${color.name}`}
                    title={color.name}
                  />
                );
              })}
            </div>
          </div>

          <div className={styles.selectorGroup}>
            <div className={styles.selectorHeader}>
              <span className={styles.selectorLabel}>
                {product.category.includes('electronics') ? 'Capacity:' : 'Size:'}
              </span>
              <strong className={styles.selectedVal}>{selectedSize}</strong>
            </div>
            <div className={styles.sizeGrid}>
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                const sizeVariant = product.variants.find(
                  (v) => v.color === selectedColor && v.size === size
                );
                const sizeStock = sizeVariant?.stock || 0;
                const isSizeSoldOut = sizeStock === 0;
                const isSizeLowStock = sizeStock > 0 && sizeStock <= 2;

                return (
                  <button
                    key={size}
                    onClick={() => handleVariantChange(selectedColor, size)}
                    className={`${styles.sizeBtn} ${
                      isSelected ? styles.selectedSizeBtn : ''
                    } ${isSizeSoldOut ? styles.soldOutSizeBtn : ''}`}
                    disabled={isSizeSoldOut}
                    aria-label={`Select size ${size}`}
                  >
                    <span className={styles.sizeText}>{size}</span>
                    {isSizeLowStock && (
                      <span className={styles.lowStockDot} title="Low Stock" />
                    )}
                    {isSizeSoldOut && (
                      <svg className={styles.strikeLine} viewBox="0 0 100 100" preserveAspectRatio="none">
                        <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.purchaseControls}>
            <div className={styles.qtyContainer}>
              <span className={styles.selectorLabel}>Quantity:</span>
              <div className={styles.qtyBox}>
                <button
                  onClick={decrementQty}
                  disabled={quantity <= 1 || isSoldOut}
                  className={styles.qtyBtn}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className={styles.qtyValue}>{isSoldOut ? 0 : quantity}</span>
                <button
                  onClick={incrementQty}
                  disabled={quantity >= maxStock || isSoldOut}
                  className={styles.qtyBtn}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.stockIndicator}>
              {isSoldOut ? (
                <span className={`${styles.stockStatus} ${styles.outOfStock}`}>
                  Sold Out
                </span>
              ) : maxStock <= 2 ? (
                <span className={`${styles.stockStatus} ${styles.lowStock}`}>
                  Low Stock — Only {maxStock} Left!
                </span>
              ) : (
                <span className={`${styles.stockStatus} ${styles.inStock}`}>
                  In Stock (Available)
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className={`${styles.addToCartBtn} ${isSoldOut ? styles.disabledBtn : ''}`}
          >
            {isSoldOut ? (
              'Sold Out'
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.cartBtnIcon}>
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Add to Cart — ${(product.price * quantity).toFixed(2)}
              </>
            )}
          </button>
        </div>
      </section>
    </main>
  );
};
