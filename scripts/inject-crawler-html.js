/**
 * Injects crawler-visible HTML from products.json.
 * Shell lives in #static-storefront-fallback (NOT #root) so React does not wipe it on mount.
 * - public/: <!--CRAWL_SHELL_START-->...<!--CRAWL_SHELL_END-->
 * - build/: comments stripped — fill/replace #static-storefront-fallback inner HTML.
 */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const isBuild = process.argv.includes('--build');
const baseDir = isBuild ? path.join(ROOT, 'build') : path.join(ROOT, 'public');
const indexPath = path.join(baseDir, 'index.html');
const productsPath = path.join(baseDir, 'products.json');

const FALLBACK_ID = 'static-storefront-fallback';

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

/** Replace inner HTML of <div id="idValue">...</div> (balanced divs). */
function replaceDivInnerById(html, idValue, inner) {
  const open = `<div id="${idValue}">`;
  const start = html.indexOf(open);
  if (start === -1) return null;
  const innerStart = start + open.length;
  let i = innerStart;
  let depth = 1;
  while (i < html.length && depth > 0) {
    const rest = html.slice(i);
    if (rest.startsWith('<div')) {
      const gt = rest.indexOf('>');
      if (gt === -1) return null;
      depth += 1;
      i += gt + 1;
    } else if (rest.startsWith('</div>')) {
      depth -= 1;
      if (depth === 0) {
        return html.slice(0, innerStart) + inner + html.slice(i + 6);
      }
      i += 6;
    } else {
      const next = rest.indexOf('<');
      if (next === -1) return null;
      if (next === 0) {
        const gt = rest.indexOf('>');
        if (gt === -1) return null;
        i += gt + 1;
      } else {
        i += next;
      }
    }
  }
  return null;
}

function injectStaticFallback(html, shell) {
  const shellRe = /<!--CRAWL_SHELL_START-->[\s\S]*?<!--CRAWL_SHELL_END-->/;
  if (shellRe.test(html)) {
    return html.replace(
      shellRe,
      `<!--CRAWL_SHELL_START-->${shell}<!--CRAWL_SHELL_END-->`,
    );
  }

  const emptySlot = new RegExp(
    `<div id="${FALLBACK_ID}"[^>]*>\\s*</div>`,
    'i',
  );
  if (emptySlot.test(html)) {
    return html.replace(
      emptySlot,
      (m) => m.replace(/>\s*<\/div>\s*$/i, `>${shell}</div>`),
    );
  }

  if (
    html.includes(`id="${FALLBACK_ID}"`) &&
    html.includes('crawl-fallback')
  ) {
    const next = replaceDivInnerById(html, FALLBACK_ID, shell);
    if (next) return next;
  }

  return null;
}

function injectNoscript(html, noscript) {
  const nsRe = /<!--CRAWL_NS_START-->[\s\S]*?<!--CRAWL_NS_END-->/;
  if (nsRe.test(html)) {
    return html.replace(
      nsRe,
      `<!--CRAWL_NS_START-->${noscript}<!--CRAWL_NS_END-->`,
    );
  }

  const nsBlock =
    /(<div class="crawl-fallback-noscript">[\s\S]*?<p><strong>Paavan Retail GmbH<\/strong>[^<]*<\/p>)([\s\S]*?)(<\/div>\s*<\/noscript>)/;
  if (nsBlock.test(html)) {
    return html.replace(nsBlock, `$1${noscript}$3`);
  }

  const craNs = /<noscript>You need to enable JavaScript to run this app\.<\/noscript>/;
  if (craNs.test(html)) {
    return html.replace(
      craNs,
      `<noscript><div class="crawl-fallback-noscript"><p><strong>Paavan Retail GmbH</strong> — full shop requires JavaScript.</p>${noscript}</div></noscript>`,
    );
  }

  return html;
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

  const withShell = injectStaticFallback(html, shell);
  if (withShell === null) {
    console.error(
      'inject-crawler-html: could not inject #static-storefront-fallback (markers / empty slot / existing crawl block).',
    );
    process.exit(1);
  }
  html = withShell;
  html = injectNoscript(html, noscript);

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log(
    'inject-crawler-html:',
    isBuild ? 'build/index.html' : 'public/index.html',
    `(${products.length} products)`,
  );
}

main();
