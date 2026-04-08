import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { formatPrice } from '../utils/money';

const QTY_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, loading, error } = useProducts();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [atcFlash, setAtcFlash] = useState(false);

  const product = useMemo(() => (id ? getById(id) : null), [id, getById]);

  useEffect(() => {
    if (!product) return undefined;
    document.title = `${product.title} — Paavan`;
    return () => {
      document.title = 'Paavan — Electronics, Fashion, Home & more';
    };
  }, [product]);

  if (loading) {
    return (
      <p className="wrap" style={{ padding: '24px 16px' }}>
        Loading…
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
  if (!product) {
    return <Navigate to="/catalog" replace />;
  }

  function handleAtc() {
    addToCart(product.id, qty);
    setAtcFlash(true);
    setTimeout(() => setAtcFlash(false), 2000);
  }

  function handleBuyNow() {
    addToCart(product.id, qty);
    navigate('/cart');
  }

  return (
    <>
      <div className="pd-grid wrap" style={{ marginTop: '24px' }}>
        <div className="pd-gallery">
          <img
            src={product.image}
            alt={product.title}
            width={600}
            height={600}
          />
        </div>
        <div className="pd-buy">
          <p className="pd-breadcrumb">
            <Link to="/catalog">All</Link> › {product.category}
          </p>
          <h1 className="pd-title">{product.title}</h1>
          <div className="pd-rating">
            <span className="p-stars">★★★★☆</span>{' '}
            <a href="#reviews">4.2 · 128 ratings</a>
          </div>
          <div className="pd-price-block">
            <span className="pd-price">
              {formatPrice(product.price, product.currency)}
            </span>{' '}
            <span className="pd-vat">Price includes VAT</span>
          </div>
          <p className="pd-stock text-success">
            In stock · Ships within 24 hours
          </p>
          <div className="pd-actions">
            <label>
              Qty{' '}
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                aria-label="Quantity"
              >
                {QTY_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="btn-primary-lg" onClick={handleAtc}>
              {atcFlash ? 'Added to cart ✓' : 'Add to cart'}
            </button>
            <button
              type="button"
              className="btn-secondary-lg"
              onClick={handleBuyNow}
            >
              Buy now
            </button>
          </div>
          <ul className="pd-trust">
            <li>✓ Secure checkout</li>
            <li>✓ 30-day returns</li>
            <li>✓ 2-year warranty on electronics</li>
          </ul>
        </div>
      </div>
      <section className="pd-desc wrap">
        <h2>About this item</h2>
        <p>{product.description}</p>
      </section>
      <section className="pd-reviews wrap" id="reviews">
        <h2>Customer reviews</h2>
        <p>
          Sample reviews for demo storefront. Verified purchases only on
          production.
        </p>
      </section>
    </>
  );
}

export default ProductPage;
