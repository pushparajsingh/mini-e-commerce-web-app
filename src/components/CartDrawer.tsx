import React, { useMemo } from 'react';
import { useCart } from '../context/CartContext';
import styles from './CartDrawer.module.scss';

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    isDrawerOpen,
    setDrawerOpen,
    removeItem,
    updateQuantity,
    clearCart
  } = useCart();

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal > 100 ? 0 : 9.99;
  }, [subtotal]);

  const tax = useMemo(() => {
    return subtotal * 0.08;
  }, [subtotal]);

  const grandTotal = useMemo(() => {
    return subtotal + shipping + tax;
  }, [subtotal, shipping, tax]);

  const handleCheckout = () => {
    alert('Thank you for your order! Checkout simulated successfully.');
    clearCart();
    setDrawerOpen(false);
  };

  return (
    <div className={`${styles.drawerWrapper} ${isDrawerOpen ? styles.open : ''}`}>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={() => setDrawerOpen(false)} />

      {/* Drawer Content */}
      <aside className={styles.drawer}>
        <div className={styles.header}>
          <h2>Shopping Cart</h2>
          <div className={styles.headerActions}>
            {cartItems.length > 0 && (
              <button onClick={clearCart} className={styles.clearBtn}>
                Clear All
              </button>
            )}
            <button
              onClick={() => setDrawerOpen(false)}
              className={styles.closeBtn}
              aria-label="Close Cart"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Item List */}
        <div className={styles.body}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <p className={styles.emptyText}>Your cart is empty</p>
              <p className={styles.emptySubtext}>Add items to get started!</p>
              <button onClick={() => setDrawerOpen(false)} className={styles.shopBtn}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className={styles.itemList}>
              {cartItems.map((item) => {
                const isMax = item.quantity >= item.maxStock;
                return (
                  <div key={`${item.id}-${item.color}-${item.size}`} className={styles.cartItem}>
                    <div className={styles.itemImageContainer}>
                      <img src={item.image} alt={item.title} className={styles.itemImage} />
                    </div>

                    <div className={styles.itemDetails}>
                      <span className={styles.itemBrand}>{item.brand}</span>
                      <h4 className={styles.itemTitle}>{item.title}</h4>
                      <div className={styles.itemMeta}>
                        <span className={styles.badge}>
                          <span className={styles.colorDot} style={{ backgroundColor: item.color.includes('#') ? item.color : '#94a3b8' }} />
                          {item.color}
                        </span>
                        <span className={styles.badge}>{item.size}</span>
                      </div>

                      {/* Quantity Selector */}
                      <div className={styles.quantityWrapper}>
                        <div className={styles.qtyControls}>
                          <button
                            onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={styles.qtyBtn}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className={styles.qtyVal}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                            disabled={isMax}
                            className={styles.qtyBtn}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        {isMax && (
                          <span className={styles.stockLimit}>
                            Max stock reached ({item.maxStock})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.itemRight}>
                      <button
                        onClick={() => removeItem(item.id, item.color, item.size)}
                        className={styles.removeBtn}
                        aria-label="Remove item"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                      <div className={styles.itemPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Billing Details */}
        {cartItems.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.billLine}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.billLine}>
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className={styles.freeShipping}>Free</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            {shipping > 0 && (
              <div className={styles.promoNote}>
                Add <strong>${(100 - subtotal).toFixed(2)}</strong> more for free shipping!
              </div>
            )}
            <div className={styles.billLine}>
              <span>Estimated Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className={styles.divider} />
            <div className={`${styles.billLine} ${styles.totalLine}`}>
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            <button onClick={handleCheckout} className={styles.checkoutBtn}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
