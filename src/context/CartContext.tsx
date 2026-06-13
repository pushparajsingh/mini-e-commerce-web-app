/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
  id: number;
  title: string;
  brand: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  maxStock: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface CartState {
  cartItems: CartItem[];
  isDrawerOpen: boolean;
  theme: 'light' | 'dark';
  toasts: Toast[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: number; color: string; size: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; color: string; size: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_DRAWER' }
  | { type: 'SET_DRAWER_OPEN'; payload: boolean }
  | { type: 'TOGGLE_THEME' }
  | { type: 'ADD_TOAST'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'REMOVE_TOAST'; payload: string };

interface CartContextProps extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: number, color: string, size: string) => void;
  updateQuantity: (id: number, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
  toggleTheme: () => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const LOCAL_STORAGE_CART_KEY = 'quickbasket_cart';
const LOCAL_STORAGE_THEME_KEY = 'quickbasket_theme';

const getInitialState = (): CartState => {
  let initialCart: CartItem[] = [];
  let initialTheme: 'light' | 'dark';

  try {
    const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    if (savedCart) {
      initialCart = JSON.parse(savedCart);
    }
  } catch {
    initialCart = [];
  }

  try {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      initialTheme = savedTheme;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = prefersDark ? 'dark' : 'light';
    }
  } catch {
    initialTheme = 'light';
  }

  return {
    cartItems: initialCart,
    isDrawerOpen: false,
    theme: initialTheme,
    toasts: []
  };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { id, color, size, title, maxStock } = action.payload;
      const quantityToAdd = action.payload.quantity || 1;
      
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === id && item.color === color && item.size === size
      );

      const newCartItems = [...state.cartItems];

      if (existingItemIndex > -1) {
        const existingItem = state.cartItems[existingItemIndex];
        const newQuantity = Math.min(existingItem.quantity + quantityToAdd, maxStock);
        
        newCartItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity
        };
      } else {
        newCartItems.push({
          ...(action.payload as CartItem),
          quantity: Math.min(quantityToAdd, maxStock)
        });
      }

      const newToast: Toast = {
        id: Math.random().toString(36).substring(2, 9),
        message: `Added ${title} (${color}, ${size}) to cart.`,
        type: 'success'
      };

      return {
        ...state,
        cartItems: newCartItems,
        isDrawerOpen: true,
        toasts: [...state.toasts, newToast]
      };
    }

    case 'REMOVE_ITEM': {
      const { id, color, size } = action.payload;
      const itemToRemove = state.cartItems.find(
        (item) => item.id === id && item.color === color && item.size === size
      );
      
      const newCartItems = state.cartItems.filter(
        (item) => !(item.id === id && item.color === color && item.size === size)
      );

      const newToast: Toast = itemToRemove ? {
        id: Math.random().toString(36).substring(2, 9),
        message: `Removed ${itemToRemove.title} from cart.`,
        type: 'info'
      } : {
        id: Math.random().toString(36).substring(2, 9),
        message: 'Item removed.',
        type: 'info'
      };

      return {
        ...state,
        cartItems: newCartItems,
        toasts: [...state.toasts, newToast]
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, color, size, quantity } = action.payload;
      
      const newCartItems = state.cartItems.map((item) => {
        if (item.id === id && item.color === color && item.size === size) {
          const clampedQuantity = Math.max(1, Math.min(quantity, item.maxStock));
          return { ...item, quantity: clampedQuantity };
        }
        return item;
      });

      return {
        ...state,
        cartItems: newCartItems
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: []
      };

    case 'TOGGLE_DRAWER':
      return {
        ...state,
        isDrawerOpen: !state.isDrawerOpen
      };

    case 'SET_DRAWER_OPEN':
      return {
        ...state,
        isDrawerOpen: action.payload
      };

    case 'TOGGLE_THEME': {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      return {
        ...state,
        theme: newTheme
      };
    }

    case 'ADD_TOAST': {
      const toast: Toast = {
        id: Math.random().toString(36).substring(2, 9),
        message: action.payload.message,
        type: action.payload.type
      };
      return {
        ...state,
        toasts: [...state.toasts, toast]
      };
    }

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload)
      };

    default:
      return state;
  }
};

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, null, getInitialState);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, state.theme);
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: number, color: string, size: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, color, size } });
  };

  const updateQuantity = (id: number, color: string, size: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, color, size, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleDrawer = () => {
    dispatch({ type: 'TOGGLE_DRAWER' });
  };

  const setDrawerOpen = (isOpen: boolean) => {
    dispatch({ type: 'SET_DRAWER_OPEN', payload: isOpen });
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    dispatch({ type: 'ADD_TOAST', payload: { message, type } });
  };

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleDrawer,
        setDrawerOpen,
        toggleTheme,
        addToast,
        removeToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
