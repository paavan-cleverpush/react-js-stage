import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CheckoutPage() {
  const navigate = useNavigate();
  const { lines, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);

  function placeOrder(e) {
    e.preventDefault();
    if (!lines.length) {
      navigate('/cart');
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      window.alert(
        'Demo only — no charge. Paavan Retail GmbH would send order confirmation email here.'
      );
      clearCart();
      setSubmitting(false);
      navigate('/');
    }, 300);
  }

  return (
    <div className="checkout-grid">
      <h1>Checkout</h1>
      <p style={{ color: '#565959' }}>
        Demo checkout — no payment is processed. Replace with your PSP in
        production.
      </p>

      {!lines.length ? (
        <p>
          Your cart is empty. <Link to="/catalog">Continue shopping</Link>
        </p>
      ) : null}

      <form onSubmit={placeOrder}>
        <div className="checkout-card">
          <h2>1. Shipping address</h2>
          <label>
            Full name
            <input type="text" name="name" autoComplete="name" required />
          </label>
          <label>
            Street &amp; number
            <input
              type="text"
              name="street"
              autoComplete="street-address"
              required
            />
          </label>
          <label>
            Postal code
            <input
              type="text"
              name="zip"
              autoComplete="postal-code"
              required
            />
          </label>
          <label>
            City
            <input
              type="text"
              name="city"
              autoComplete="address-level2"
              required
            />
          </label>
          <label>
            Country
            <select name="country" defaultValue="Germany">
              <option>Germany</option>
              <option>Austria</option>
              <option>Netherlands</option>
              <option>France</option>
            </select>
          </label>
        </div>

        <div className="checkout-card">
          <h2>2. Delivery</h2>
          <label>
            <input type="radio" name="ship" defaultChecked /> Standard (3–5
            days) — FREE over €29
          </label>
          <br />
          <label>
            <input type="radio" name="ship" /> Express (1–2 days) — €9.99
          </label>
        </div>

        <div className="checkout-card">
          <h2>3. Payment</h2>
          <label>
            <input type="radio" name="pay" defaultChecked /> Card (Visa,
            Mastercard)
          </label>
          <br />
          <label>
            <input type="radio" name="pay" /> PayPal
          </label>
          <br />
          <label>
            <input type="radio" name="pay" /> Klarna
          </label>
        </div>

        <button
          type="submit"
          className="btn-checkout"
          style={{ border: 'none', cursor: 'pointer', fontSize: 16 }}
          disabled={!lines.length || submitting}
        >
          {submitting ? 'Placing…' : 'Place your order (demo)'}
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;
