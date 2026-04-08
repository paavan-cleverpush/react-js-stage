import { Link } from 'react-router-dom';

function About() {
  return (
    <article className="static-page wrap">
      <h1>About Paavan</h1>
      <p>
        <strong>Paavan Retail GmbH</strong> is a European online retailer
        focused on <strong>tangible products</strong> — electronics, fashion,
        home goods, and sports equipment. We source inventory, hold stock or
        dropship from verified suppliers, and deliver sealed retail packaging
        to customers.
      </p>
      <h2>What we sell</h2>
      <p>
        Only <strong>physical items</strong> you can unbox. We do not sell
        consulting, SaaS subscriptions, or intangible services through this shop.
      </p>
      <h2>Technology</h2>
      <p>
        We use <strong>CleverPush</strong> for optional{' '}
        <strong>customer engagement</strong> (e.g. back-in-stock and delivery
        notifications). CleverPush does not fulfil orders; all sales contracts
        and shipping obligations are with{' '}
        <strong>Paavan Retail GmbH</strong>.
      </p>
      <h2>Quality</h2>
      <p>
        Two-year warranty on qualifying electronics (per manufacturer), 30-day
        returns on most unopened items. See{' '}
        <Link to="/returns">returns policy</Link>.
      </p>
      <p>
        <Link to="/catalog">Shop now</Link>
      </p>
    </article>
  );
}

export default About;
