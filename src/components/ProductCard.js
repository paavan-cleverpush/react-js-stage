import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/money';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const href = `/product/${encodeURIComponent(product.id)}`;

  function onAtc() {
    addToCart(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="p-card">
      <Link to={href} className="p-card-img-wrap">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          width={400}
          height={400}
        />
      </Link>
      <div className="p-card-body">
        <Link to={href} className="p-card-title">
          {product.title}
        </Link>
        <div className="p-card-meta">
          <span className="p-stars">★★★★☆</span>{' '}
          <span className="p-reviews">(128)</span>
        </div>
        <div className="p-card-price">
          {formatPrice(product.price, product.currency)}
        </div>
        <div className="p-card-ship">
          FREE delivery <strong>Tomorrow</strong> on orders over €29
        </div>
        <button type="button" className="btn-atc" onClick={onAtc}>
          {added ? 'Added ✓' : 'Add to cart'}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
