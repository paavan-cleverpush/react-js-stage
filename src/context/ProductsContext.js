import {
  createContext,
  useContext,
  useMemo,
} from 'react';

import { productsFromThaliaMeta } from '../data/thaliaMeta';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const products = useMemo(() => productsFromThaliaMeta(), []);

  const getById = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));
    return (id) => map.get(id);
  }, [products]);

  const value = useMemo(
    () => ({
      products,
      loading: false,
      error: null,
      getById,
    }),
    [products, getById]
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
