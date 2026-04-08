import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/money';

function DealsStrip({ products }) {
  const deals = products.slice(12, 18);
  if (!deals.length) return null;

  return (
    <div className="deals-scroll">
      {deals.map((p) => {
        const href = `/product/${encodeURIComponent(p.id)}`;
        const sale = p.price * 0.85;
        return (
          <div key={p.id} className="deal-card">
            <Link to={href}>
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                width={200}
                height={200}
              />
            </Link>
            <Link to={href} className="deal-title">
              {p.title.length > 40 ? `${p.title.slice(0, 40)}…` : p.title}
            </Link>
            <div className="deal-price">
              {formatPrice(sale, p.currency)}{' '}
              <s className="deal-was">{formatPrice(p.price, p.currency)}</s>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DealsStrip;
