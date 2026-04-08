import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${process.env.PUBLIC_URL || ''}/products.json`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load catalogue');
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Load error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getById = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));
    return (id) => map.get(id);
  }, [products]);

  const value = useMemo(
    () => ({ products, loading, error, getById }),
    [products, loading, error, getById]
  );

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
