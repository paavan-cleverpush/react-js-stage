import { Link } from 'react-router-dom';

function Contact() {
  return (
    <article className="static-page wrap">
      <h1>Contact us</h1>
      <p>
        Questions about <strong>orders, shipping, or returns</strong> — we sell
        physical products only.
      </p>
      <section>
        <h2>Customer service</h2>
        <p>
          Email:{' '}
          <a href="mailto:support@Paavan-shop.example">
            support@Paavan-shop.example
          </a>
          <br />
          Phone: +49 (0) 30 0000 0000
          <br />
          Hours: Mon–Fri 9:00–18:00 CET
        </p>
      </section>
      <section id="imprint">
        <h2>Imprint (legal disclosure)</h2>
        <p>
          <strong>Paavan Retail GmbH</strong>
          <br />
          Musterstraße 12
          <br />
          10115 Berlin
          <br />
          Germany
        </p>
        <p>
          Managing directors: Jane Doe, John Smith
          <br />
          Register court: Amtsgericht Berlin HRB 000000
          <br />
          VAT ID: DE000000000
        </p>
        <p>
          <em>Replace the above with your real company data when going live.</em>
        </p>
      </section>
      <section>
        <h2>EU dispute resolution</h2>
        <p>
          The European Commission provides a platform for online dispute
          resolution:{' '}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
          >
            ODR
          </a>
          . We are not obliged to participate in consumer arbitration but will
          engage in good faith.
        </p>
      </section>
      <p>
        <Link to="/catalog">Back to shop</Link>
      </p>
    </article>
  );
}

export default Contact;
