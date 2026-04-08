/**
 * Injects crawler-visible HTML from public/products.json into index.html.
 * Idempotent: uses <!--CRAWL_SHELL_START-->...<!--CRAWL_SHELL_END--> wrappers.
 */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const isBuild = process.argv.includes('--build');
const baseDir = isBuild ? path.join(ROOT, 'build') : path.join(ROOT, 'public');
const indexPath = path.join(baseDir, 'index.html');
const productsPath = path.join(baseDir, 'products.json');

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

function buildShell(products) {
  const items = products
    .map((p) => {
      const href = `/product/${encodeURIComponent(p.id)}`;
      const price = `${p.price} ${p.currency || 'EUR'}`;
      return `<li><a href="${href}">${escapeHtml(p.title)}</a> — ${escapeHtml(price)}</li>`;
    })
    .join('\n');

  return [
    '<div class="crawl-fallback" data-static-fallback="1">',
    '<header class="crawl-fallback__chrome">',
    '<p><strong>Paavan Retail GmbH</strong> — online store for tangible products (electronics, fashion, home, sports).</p>',
    '<nav aria-label="Store">',
    '<a href="/">Home</a> · ',
    '<a href="/catalog">All products</a> · ',
    '<a href="/cart">Cart</a> · ',
    '<a href="/shipping">Shipping</a> · ',
    '<a href="/returns">Returns</a> · ',
    '<a href="/contact">Contact</a>',
    '</nav>',
    '</header>',
    '<main class="crawl-fallback__main">',
    '<h1>Physical products, delivered to your door</h1>',
    '<p>Paavan sells only <strong>tangible goods</strong> — electronics, apparel, home products &amp; more. The interactive shop loads in your browser; this section lists every product link for crawlers and accessibility.</p>',
    '<h2>Product catalogue</h2>',
    '<ul class="crawl-fallback__catalog">',
    items,
    '</ul>',
    '<p class="crawl-fallback__note">Each link goes to a product page with image, price, description, and add to cart when JavaScript is enabled.</p>',
    '</main>',
    '</div>',
  ].join('');
}

function buildNoscriptCatalog(products) {
  const items = products
    .map((p) => {
      const href = `/product/${encodeURIComponent(p.id)}`;
      return `<li><a href="${href}">${escapeHtml(p.title)}</a></li>`;
    })
    .join('\n');
  return `<p><strong>All product links</strong></p><ul>${items}</ul>`;
}

function main() {
  if (!fs.existsSync(indexPath)) {
    console.error('inject-crawler-html: missing', indexPath);
    process.exit(isBuild ? 0 : 1);
  }
  if (!fs.existsSync(productsPath)) {
    console.error('inject-crawler-html: missing', productsPath);
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  if (!Array.isArray(products) || !products.length) {
    console.warn('inject-crawler-html: no products, skipping');
    return;
  }

  let html = fs.readFileSync(indexPath, 'utf8');
  const shell = buildShell(products);
  const noscript = buildNoscriptCatalog(products);

  const shellRe = /<!--CRAWL_SHELL_START-->[\s\S]*?<!--CRAWL_SHELL_END-->/;
  if (!shellRe.test(html)) {
    console.error(
      'inject-crawler-html: missing <!--CRAWL_SHELL_START--> / <!--CRAWL_SHELL_END-->',
    );
    process.exit(1);
  }
  html = html.replace(
    shellRe,
    `<!--CRAWL_SHELL_START-->${shell}<!--CRAWL_SHELL_END-->`,
  );

  const nsRe = /<!--CRAWL_NS_START-->[\s\S]*?<!--CRAWL_NS_END-->/;
  if (nsRe.test(html)) {
    html = html.replace(
      nsRe,
      `<!--CRAWL_NS_START-->${noscript}<!--CRAWL_NS_END-->`,
    );
  }

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log(
    'inject-crawler-html:',
    isBuild ? 'build/index.html' : 'public/index.html',
    `(${products.length} products)`,
  );
}

main();
