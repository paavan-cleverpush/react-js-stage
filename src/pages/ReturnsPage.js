import { Link } from 'react-router-dom';

function ReturnsPage() {
  return (
    <article className="static-page wrap">
      <h1>Returns &amp; refunds</h1>
      <p>
        For <strong>unused physical products</strong> in original packaging, you
        may withdraw within <strong>30 days</strong> of delivery (EU consumer
        rights).
      </p>
      <h2>How to return</h2>
      <ol>
        <li>Log in to your account or use the link in your order email.</li>
        <li>
          Print the prepaid return label (Germany) or request RMA for other
          countries.
        </li>
        <li>Drop off at the carrier or schedule pickup for large items.</li>
      </ol>
      <h2>Refunds</h2>
      <p>
        After we receive and inspect the return, we refund the{' '}
        <strong>product price</strong> to your original payment method within
        14 days. Shipping charges are non-refundable unless the item was
        defective or incorrect.
      </p>
      <h2>Excluded</h2>
      <p>
        Opened hygiene products, personalised items, and digital codes (we do
        not sell digital-only goods on this store).
      </p>
      <p>
        <Link to="/contact">Contact support</Link>
      </p>
    </article>
  );
}

export default ReturnsPage;
