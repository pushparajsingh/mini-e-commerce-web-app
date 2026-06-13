# Design & Architectural Decisions

This document outlines the design decisions and trade-offs made during the implementation of the mini e-commerce application.

---

## 1. Stack and Tooling

### React 18+ with TypeScript
- **Decision:** Utilized React 18 functional components with hooks, paired with TypeScript for static type-safety.
- **Justification:** Functional components and hooks (`useState`, `useReducer`, `useMemo`, `useContext`) provide a clean, modern approach to rendering UI and managing hooks. TypeScript interfaces (e.g. `CartItem`, `EnhancedProduct`, `Variant`) ensure correct typing across pages and components, preventing common runtime properties bugs (like accessing undefined inventory structures).

### Vite
- **Decision:** Used Vite as the build tool.
- **Justification:** Extremely fast Hot Module Replacement (HMR) speeds up development, and rollup builds compile small, efficient bundles.

### SCSS Modules
- **Decision:** Implemented custom styles using Sass/SCSS Modules (`*.module.scss`).
- **Justification:** By scoping CSS modules directly to each component, we prevent global class namespace collisions. Using Sass variables (`variables.scss`) allows centralizing spacing tokens, colors, breakpoints, and mixins (like glassmorphism) for both light and dark themes.

---

## 2. State Management & Persistence

### React Context API + useReducer
- **Decision:** Avoided heavy state libraries (like Redux Toolkit or Zustand) in favor of the React Context API combined with the `useReducer` hook.
- **Justification:** Context + useReducer is native to React, zero-dependency, and lightweight. It is the perfect choice for a mini e-commerce app where global state consists of a cart item list, drawer toggle state, toast notifications, and theme settings. The reducer keeps state transactions explicit (e.g. `ADD_ITEM`, `UPDATE_QUANTITY`), making it easy to test and extend.

### LocalStorage Syncing
- **Decision:** Synced cart state and theme preferences to `localStorage` using standard `useEffect` side effects inside the context provider.
- **Justification:** Separating persistence logic into side effects keeps the reducer pure. The cart survives page refreshes, and the UI rehydrates instantly with the user's last selected color theme.

---

## 3. Product Data Enhancement Engine

### Deterministic Mock Engine (`productHelper.ts`)
- **Decision:** Built a utility to intercept raw API product data from the Fake Store API and augment it with mock features:
  - Luxury Brand names (derived by product category).
  - Size options (XS-XXL for clothing, Gigabyte capacity for electronics, One Size for jewelry).
  - Color swatches with hexadecimal color codes.
  - Variant Stock inventory levels mapped to size-color combinations (available, low stock, sold out).
  - Discounted pricing (crossed-out original prices).
  - Multiple thumbnail image arrays.
- **Justification:** The Fake Store API only returns static, flat item descriptions. By deterministically hashing fields based on the product ID, we generate complete, realistic variant details (like stock levels and colors) without needing a database.

### CSS-Based Multi-Angle Swapping
- **Decision:** Simulating multiple product angles by appending URL hashes (`#zoom`, `#tilt`, `#detail`) and applying custom CSS scale/rotation/translation adjustments inside the UI.
- **Justification:** Fake Store API only returns one image per product. Appending hashes lets us reuse the image URL without loading broken mock images, while applying CSS transforms offers a rich, tactile gallery swapper experience.

---

## 4. Deep Linking

### URL Syncing for Product Detail Page
- **Decision:** Implemented URL parameter syncing (`?color=X&size=Y`) using React Router's `useSearchParams` hook.
- **Justification:** Navigating directly to a URL auto-loads and selects the matching variant. If the URL parameters are empty or invalid, the component searches for the first available in-stock variant and updates the URL. This aligns with modern e-commerce SEO and sharing guidelines.

---

## 5. UI Design & Aesthetics

### Visual Polish
- **Decision:** Implemented a glassmorphic header navbar, fluid transitions, card hover elevation lifts, loading skeleton layouts, and notification toasts.
- **Justification:** To elevate the interface from a generic bootstrap look, the application utilizes clean Google Fonts, HSL-based dark mode tokens, and smooth bezier curves for CSS properties.

---

## 6. Trade-offs

1. **Client-Side Mocking Overhead:** Since product variations are computed on the client side, there is a minor cost when fetching lists. However, calculations are deterministic and rapid, keeping list loads under 2ms.
2. **Offline Mode:** The application relies on the external `fakestoreapi.com` server. In case of downtime, the app renders a clean error landing page with a reload retry mechanism.
