import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/Toast';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';

const Footer: React.FC = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-card)',
      padding: '48px 0 32px',
      marginTop: 'auto',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '32px'
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 750,
            marginBottom: '16px',
            color: 'var(--text-primary)'
          }}>
            Quick<span style={{ color: 'var(--accent)' }}>Basket</span>
          </h3>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '320px'
          }}>
            A premium demonstration of modern web engineering. Featuring instant cart hydration, dynamic inventory swatches, and responsive design.
          </p>
        </div>

        <div style={{ flex: '1 1 150px' }}>
          <h4 style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '16px',
            color: 'var(--text-primary)'
          }}>
            Categories
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Electronics', 'Jewelery', "Men's Clothing", "Women's Clothing"].map((cat) => (
              <li key={cat}>
                <a href="/" style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: '1 1 150px' }}>
          <h4 style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '16px',
            color: 'var(--text-primary)'
          }}>
            Stack Used
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <li>React 18+ (Hooks)</li>
            <li>TypeScript</li>
            <li>Vite Tooling</li>
            <li>SCSS Modules</li>
            <li>React Context API</li>
          </ul>
        </div>
      </div>

      <div className="container" style={{
        marginTop: '40px',
        paddingTop: '24px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <span>&copy; {new Date().getFullYear()} QuickBasket. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Designed with visual excellence</span>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          background: 'var(--bg)',
          color: 'var(--text-primary)',
          transition: 'background-color 0.3s ease, color 0.3s ease'
        }}>
          <Navbar />

          <div style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
          </div>

          <Footer />

          <CartDrawer />

          <ToastContainer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
