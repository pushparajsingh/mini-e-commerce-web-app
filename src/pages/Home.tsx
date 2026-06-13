/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { enhanceProduct } from '../utils/productHelper';
import type { EnhancedProduct, RawProduct } from '../utils/productHelper';
import { ProductCard } from '../components/ProductCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import styles from './Home.module.scss';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<EnhancedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<RawProduct[]>('https://fakestoreapi.com/products');
      const enhanced = response.data.map((p) => enhanceProduct(p));
      setProducts(enhanced);
    } catch (err: unknown) {
      console.error(err);
      setError('Failed to load products. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'default':
      default:
        break;
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortBy]);

  if (loading) {
    return (
      <main className="container" style={{ padding: '40px 24px' }}>
        <div className={styles.skeletonToolbar}>
          <div className={styles.skeletonTab} style={{ width: '400px' }} />
          <div className={styles.skeletonInput} style={{ width: '250px' }} />
        </div>
        <SkeletonLoader type="card" count={8} />
      </main>
    );
  }

  if (error) {
    return (
      <main className={`${styles.errorState} container animate-fade-in`}>
        <div className={styles.errorIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchProducts} className={styles.retryBtn}>
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="container animate-fade-in">
      {/* Hero Header */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroSubtitle}>New Arrivals 2026</span>
          <h1 className={styles.heroTitle}>Elevate Your Everyday Style</h1>
          <p className={styles.heroText}>
            Explore our curated catalog of apparel, electronics, and accessories. Fast delivery, easy returns.
          </p>
        </div>
      </section>

      {/* Toolbar Filter / Search */}
      <section className={styles.toolbar}>
        {/* Category Tabs */}
        <div className={styles.categoriesWrapper}>
          <div className={styles.categoryTabs}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`${styles.categoryTab} ${selectedCategory === cat ? styles.activeTab : ''}`}
              >
                {cat === 'all' ? 'All Products' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Sort Panel */}
        <div className={styles.filtersPanel}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className={styles.clearSearch} aria-label="Clear Search">
                &times;
              </button>
            )}
          </div>

          <div className={styles.sortBox}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
              aria-label="Sort products"
            >
              <option value="default">Sort: Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Popularity: Top Rated</option>
            </select>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.sortIcon}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className={styles.noResults}>
          <h3>No products match your criteria</h3>
          <p>Try clearing your search or selecting another category.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSortBy('default');
            }}
            className={styles.resetFiltersBtn}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};
