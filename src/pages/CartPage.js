import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { formatPrice } from '../utils/money';

function CartPage() {
  const { lines, updateLine, removeLine } = useCart();
  const { getById, loading } = useProducts();

  if (loading) {
    return (
      <p className="wrap" style={{ padding: '24px 16px' }}>
        Loading…
      </p>
    );
  }

  let subtotal = 0;
  const rows = [];
  lines.forEach((line) => {
    const p = getById(line.id);
    if (!p) return;
    const lineTotal = p.price * line.qty;
    subtotal += lineTotal;
    rows.push({ line, p, lineTotal });
  });

  return (
    <div className="cart-page">
      <h1>Shopping cart</h1>
      <div className="cart-table-wrap">
        <table id="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!lines.length ? (
              <tr>
                <td colSpan={5} className="empty-cart">
                  Your cart is empty.{' '}
                  <Link to="/catalog">Continue shopping</Link>
                </td>
              </tr>
            ) : (
              rows.map(({ line, p, lineTotal }) => (
                <tr key={p.id}>
                  <td>
                    <div className="cart-line">
                      <img
                        src={p.image}
                        alt={p.title}
                        width={80}
                        height={80}
                      />
                      <div>
                        <Link to={`/product/${encodeURIComponent(p.id)}`}>
                          {p.title}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td>{formatPrice(p.price, p.currency)}</td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      className="cart-qty"
                      aria-label={`Quantity for ${p.title}`}
                      value={line.qty}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (Number.isNaN(v) || v <= 0) removeLine(p.id);
                        else updateLine(p.id, v);
                      }}
                    />
                  </td>
                  <td>{formatPrice(lineTotal, p.currency)}</td>
                  <td>
                    <button
                      type="button"
                      className="link-btn cart-remove"
                      onClick={() => removeLine(p.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="cart-summary">
        <div>
          Subtotal: <strong>{formatPrice(subtotal, 'EUR')}</strong>
        </div>
        {lines.length > 0 ? (
          <Link to="/checkout" className="btn-checkout">
            Proceed to checkout
          </Link>
        ) : null}
        <p style={{ fontSize: 14, color: '#565959', marginTop: 12 }}>
          <Link to="/catalog">Continue shopping</Link>
        </p>
      </div>
    </div>
  );
}

export default CartPage;
