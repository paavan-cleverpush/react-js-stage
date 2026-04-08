import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Fashion', value: 'Fashion' },
  { label: 'Home & Kitchen', value: 'Home' },
  { label: 'Sports & Outdoors', value: 'Sports' },
];

function CatalogPage() {
  const [params] = useSearchParams();
  const category = params.get('category') || '';
  const q = (params.get('q') || '').toLowerCase().trim();
  const { products, loading, error } = useProducts();

  const list = products.filter((p) => {
    if (category && p.category !== category) return false;
    if (q && !p.title.toLowerCase().includes(q)) return false;
    return true;
  });

  if (loading) {
    return (
      <p className="wrap" style={{ padding: '24px 16px' }}>
        Loading catalogue…
      </p>
    );
  }
  if (error) {
    return (
      <p className="wrap" style={{ padding: '24px 16px', color: '#b12704' }}>
        {error}
      </p>
    );
  }

  return (
    <div className="catalog-layout">
      <aside className="filter-panel">
        <h3>Department</h3>
        {CATEGORIES.map((c) => {
          const next = new URLSearchParams(params);
          if (c.value) next.set('category', c.value);
          else next.delete('category');
          if (q) next.set('q', params.get('q'));
          const qs = next.toString();
          const to = '/catalog' + (qs ? `?${qs}` : '');
          const isOn =
            (c.value === '' && !category) || c.value === category;
          return (
            <Link
              key={c.value || 'all'}
              to={to}
              className={'filter-cat' + (isOn ? ' is-on' : '')}
            >
              {c.label}
            </Link>
          );
        })}
      </aside>
      <div>
        <div className="catalog-toolbar">
          <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Results</h1>
          <span className="p-card-meta">{list.length} products</span>
        </div>
        <div className="product-grid" style={{ padding: 0 }}>
          {list.length ? (
            list.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p className="empty-catalog">No products match your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CatalogPage;
