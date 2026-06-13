# QuickBasket - Mini E-Commerce Web App

QuickBasket is a premium, lightweight, responsive e-commerce web application built using **React 18+**, **TypeScript**, **Vite**, and **SCSS Modules**. The application is entirely dependency-free for state management, utilising the native React Context API and `useReducer` to power global shopping operations. 

Data is fetched dynamically from the [Fake Store API](https://fakestoreapi.com/) and enriched on-the-fly with rich variant features like luxury brand names, size-color configurations, stock levels, and alternative multi-angle photo mockups.

---

## Key Features

1. **Storefront Listing Page (`/`)**
   - Fetches product collections from the Fake Store API.
   - Fully responsive layout (CSS Grid) that scales fluidly between mobile stacks and desktop grids.
   - Toolbar panel with a live search filter, category tab selectors, and sorting options (recommended, price low-to-high, price high-to-low, popularity).
   - "Quick Add to Cart" buttons that automatically select the first available variant of a product.
   - Shimmering skeleton loading states that prevent layouts from jumping.

2. **Product Detail Page (`/product/:id`)**
   - Responsive layout: clean two-column grid on desktop, single-column stacked layout on mobile.
   - **Interactive Multi-Angle Swapping Deck:** Clicking secondary thumbnails swaps the main preview image. Custom CSS transformations simulate distinct visual viewpoints (zoom-in crops, angular tilts, translation slides).
   - **Stock-Level Variant Swatches:** Interactive color and size swatches that query a simulated inventory ledger. Sizes visually indicate "In Stock", "Low Stock" (warning indicator), or "Sold Out" (crossed out, disabled).
   - **Deep Linking Query Synchronization:** Synced query string state (`?color=X&size=Y`). Sharing or reloading a configured product URL automatically recovers and selects the specified variants.
   - **Locked Quantity Selector:** Prevents purchasing more items than available in the simulated inventory database. Disables automatically if the variant is sold out.

3. **Global Cart & Slide-Out Drawer**
   - Side-panel slide-in drawer driven by CSS transitions, complete with a dark blur backdrop overlay.
   - Direct quantity modification, item removal triggers, and a dynamic checkout subtotal, tax (8%), and shipping estimation calculator.
   - Automatic hydration and synchronization of cart state and color themes to `localStorage`.

4. **Premium Visual Polish**
   - **Theme Toggle:** Effortless toggling between light and dark modes with persistent memory saving.
   - **Toast Messages:** Slide-in alert cards that verify card edits, additions, and capacity warnings with micro-animations.

---

## Tech Stack

- **Framework:** React 18+ (Functional Components & Hooks)
- **Language:** TypeScript
- **Styling:** Vanilla SCSS Modules (no Tailwind or styled-components to ensure zero build bloating)
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **State Management:** React Context API + `useReducer`
- **Build Tool:** Vite

---

## Folder Structure

```plaintext
/src
  /assets         # Logo graphics, default logos
  /components     # Scoped UI elements (Navbar, CartDrawer, ProductCard, Toast, StarRating, SkeletonLoader)
  /context        # CartContext.tsx (Global state provider & Reducer hooks)
  /hooks          # Custom hooks (e.g., useLocalStorage)
  /pages          # Primary routing pages (Home, ProductDetail)
  /styles         # Sass design variables and base global resets
  /utils          # Helper functions (API processing & deterministic enhancement)
  App.tsx         # Main entry, layout containers, and route tables
  main.tsx        # React client mounter
```

---

## Setup & Running Locally

Ensure you have [Node.js](https://nodejs.org/) version 18+ installed.

### 1. Install Dependencies
Clone the repository and run:
```bash
npm install
```

### 2. Launch Local Development Server
Run the local dev server:
```bash
npm run dev
```
Open your browser and navigate to the local link (typically `http://localhost:5173`).

### 3. Check for Lints
Verify code styling and rule conformity:
```bash
npm run lint
```

### 4. Build Production Bundle
To compile the TypeScript project and generate the optimized rollup distribution:
```bash
npm run build
```

---

## Architectural Decisions

Detailed justifications on data structures, state reductions, SCSS scoping, and trade-offs can be found in [DECISIONS.md](./DECISIONS.md).
