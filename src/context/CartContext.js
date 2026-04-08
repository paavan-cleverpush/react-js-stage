import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const CART_KEY = 'Paavan-cart';

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [lines, setLines] = useState(() => readCart());

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines]);

  const addToCart = useCallback((productId, qty = 1) => {
    setLines((prev) => {
      const next = [...prev];
      const found = next.find((l) => l.id === productId);
      if (found) found.qty += qty;
      else next.push({ id: productId, qty });
      return next;
    });
  }, []);

  const updateLine = useCallback((productId, qty) => {
    setLines((prev) => {
      const rest = prev.filter((l) => l.id !== productId);
      if (qty > 0) rest.push({ id: productId, qty });
      return rest;
    });
  }, []);

  const removeLine = useCallback((productId) => {
    setLines((prev) => prev.filter((l) => l.id !== productId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const cartCount = useMemo(
    () => lines.reduce((n, l) => n + (l.qty || 0), 0),
    [lines]
  );

  const value = useMemo(
    () => ({
      lines,
      addToCart,
      updateLine,
      removeLine,
      clearCart,
      cartCount,
    }),
    [lines, addToCart, updateLine, removeLine, clearCart, cartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
