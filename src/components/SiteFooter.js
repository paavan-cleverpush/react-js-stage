import { Link } from 'react-router-dom';

const LEGAL_NAME = 'Paavan Retail GmbH';
const SHOP_TAGLINE = 'Paavan.de';

function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer id="site-footer">
      <div className="footer-grid wrap">
        <div>
          <h4>Get to know us</h4>
          <ul>
            <li>
              <Link to="/about">About {LEGAL_NAME}</Link>
            </li>
            <li>
              <Link to="/contact">Contact &amp; imprint</Link>
            </li>
            <li>
              <Link to="/features">CleverPush engagement</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Shop with confidence</h4>
          <ul>
            <li>
              <Link to="/shipping">Shipping rates &amp; times</Link>
            </li>
            <li>
              <Link to="/returns">Returns &amp; refunds</Link>
            </li>
            <li>
              <Link to="/contact">Track your order</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Legal</h4>
          <ul>
            <li>
              <Link to="/contact#imprint">Imprint</Link>
            </li>
            <li>
              <Link to="/returns">Withdrawal policy</Link>
            </li>
            <li>Payments: cards, PayPal, Klarna (where available)</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom wrap">
        <p>
          © {year} <strong>{LEGAL_NAME}</strong> · {SHOP_TAGLINE} · We sell{' '}
          <strong>tangible physical products</strong> only. CleverPush is used for
          customer notifications; all orders are fulfilled by {LEGAL_NAME}.
        </p>
      </div>
    </footer>
  );
}

export default SiteFooter;
