import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, USE_MOCK_DATA } from '../config';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const STORAGE_KEY = 'shrunity.cart.v1';
const MAX_QTY = 10;
const CartContext = createContext(null);

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const exists = state.some((l) => l.key === action.line.key);
      if (exists) {
        return state.map((l) => (l.key === action.line.key ? { ...l, qty: Math.min(MAX_QTY, l.qty + action.line.qty) } : l));
      }
      return [...state, action.line];
    }
    case 'remove':
      return state.filter((l) => l.key !== action.key);
    case 'qty':
      return state.map((l) => (l.key === action.key ? { ...l, qty: Math.max(1, Math.min(MAX_QTY, action.qty)) } : l));
    case 'clear':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, load);
  const { isAuthenticated } = useAuth();
  const { push } = useToast();

  // Persist to localStorage so the guest cart survives reloads and the sign-in redirect.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or blocked */
    }
  }, [items]);

  // Signed-in users: save a snapshot to the backend (debounced). Failures are non-fatal.
  useEffect(() => {
    if (!isAuthenticated || USE_MOCK_DATA) return undefined;
    const timer = setTimeout(() => {
      cartService.save(items).catch((err) => console.debug('Cart sync skipped:', err.message));
    }, 800);
    return () => clearTimeout(timer);
  }, [items, isAuthenticated]);

  const addItem = useCallback(
    (product, { size, color, qty = 1, silent = false }) => {
      dispatch({
        type: 'add',
        line: {
          key: `${product.id}|${size}|${color}`,
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.salePrice ?? product.price,
          mrp: product.price,
          size,
          color,
          qty,
        },
      });
      if (!silent) push(`${product.name} added to your cart.`);
    },
    [push],
  );

  const removeItem = useCallback((key) => dispatch({ type: 'remove', key }), []);
  const updateQty = useCallback((key, qty) => dispatch({ type: 'qty', key, qty }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  const totals = useMemo(() => {
    const count = items.reduce((n, l) => n + l.qty, 0);
    const subtotal = items.reduce((n, l) => n + l.price * l.qty, 0);
    const mrpTotal = items.reduce((n, l) => n + l.mrp * l.qty, 0);
    const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    return { count, subtotal, savings: mrpTotal - subtotal, shipping, total: subtotal + shipping };
  }, [items]);

  const value = useMemo(
    () => ({ items, ...totals, addItem, removeItem, updateQty, clear, maxQty: MAX_QTY }),
    [items, totals, addItem, removeItem, updateQty, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
