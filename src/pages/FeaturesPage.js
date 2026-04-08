import { Link } from 'react-router-dom';

function FeaturesPage() {
  return (
    <article className="static-page wrap">
      <h1>How we keep you informed</h1>
      <p>
        <strong>Paavan Retail GmbH</strong> sells{' '}
        <strong>physical products</strong> through this website. For optional
        updates (order status, back-in-stock, offers), we use{' '}
        <strong>CleverPush</strong> — a customer messaging layer.
      </p>
      <h2>What CleverPush is (and is not)</h2>
      <ul>
        <li>
          <strong>Is:</strong> web push, email capture, and similar{' '}
          <strong>notification</strong> tools.
        </li>
        <li>
          <strong>Is not:</strong> the seller of record, payment processor, or
          warehouse — all product sales remain with Paavan Retail GmbH.
        </li>
      </ul>
      <h2>Your choices</h2>
      <p>
        You can browse and buy without enabling notifications. Marketing
        messages require your consent where required by law (e.g. GDPR).
      </p>
      <p>
        <Link to="/catalog">Back to shop</Link>
      </p>
    </article>
  );
}

export default FeaturesPage;
