import DealsStrip from '../components/DealsStrip';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';

function HomePage() {
  const { products, loading, error } = useProducts();

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

  const grid = products.slice(0, 12);

  return (
    <>
      <section className="hero-banner">
        <h1>Physical products, delivered to your door</h1>
        <p>
          Paavan sells only <strong>tangible goods</strong> — electronics,
          apparel, home products &amp; more. Real prices, real checkout, EU
          shipping.
        </p>
      </section>

      <h2 className="section-title">Today&apos;s deals</h2>
      <DealsStrip products={products} />

      <h2 className="section-title">Best sellers in your region</h2>
      <div className="product-grid">
        {grid.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <section className="cp-section">
        <div className="container">
          <h2>Stay updated</h2>
          <p>
            Subscribe for order updates and offers (CleverPush-powered
            notifications on the static demo). In this React build you can embed
            the same CleverPush scripts in{' '}
            <code>public/index.html</code> when needed.
          </p>
        </div>
      </section>
    </>
  );
}

export default HomePage;
