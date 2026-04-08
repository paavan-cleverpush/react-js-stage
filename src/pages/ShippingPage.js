import { Link } from 'react-router-dom';

function ShippingPage() {
  return (
    <article className="static-page wrap">
      <h1>Shipping information</h1>
      <p>
        <strong>Paavan Retail GmbH</strong> ships{' '}
        <strong>physical products only</strong> — every item in our catalogue is
        a tangible good packed and handed to a carrier.
      </p>
      <h2>Coverage</h2>
      <p>
        We deliver to Germany, Austria, Benelux, and France. Other EU countries
        on request at checkout.
      </p>
      <h2>Rates &amp; speed</h2>
      <ul>
        <li>
          <strong>Standard</strong> — 3–5 business days; <strong>FREE</strong>{' '}
          on orders €29+ (otherwise €4.99).
        </li>
        <li>
          <strong>Express</strong> — 1–2 business days; €9.99 flat.
        </li>
      </ul>
      <h2>Tracking</h2>
      <p>
        You receive a tracking link by email when the parcel leaves our
        warehouse. CleverPush may also send shipment status messages —
        fulfilment remains solely with Paavan Retail GmbH.
      </p>
      <h2>Large / heavy items</h2>
      <p>
        TVs, small appliances, and bulky homeware may ship on a pallet with
        scheduled delivery — details at checkout.
      </p>
      <p>
        <Link to="/catalog">Continue shopping</Link>
      </p>
    </article>
  );
}

export default ShippingPage;
