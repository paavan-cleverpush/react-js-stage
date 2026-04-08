/**
 * Injects crawler-visible HTML into #static-storefront-fallback (outside #root).
 * Handles minified CRA output: attribute order, quotes, stripped HTML comments.
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

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

/** Opening <div ... id="idValue" ...> with any attribute order / quoting (CRA minify). */
function findDivOpenEndIndex(html, idValue) {
  const id = escapeRegExp(idValue);
  const patterns = [
    new RegExp(`<div\\b[^>]*\\bid\\s*=\\s*"${id}"[^>]*>`, 'i'),
    new RegExp(`<div\\b[^>]*\\bid\\s*=\\s*'${id}'[^>]*>`, 'i'),
    new RegExp(`<div\\b[^>]*\\bid\\s*=\\s*${id}\\b[^>]*>`, 'i'),
  ];
  for (const re of patterns) {
    const m = re.exec(html);
    if (m) return m.index + m[0].length;
  }
  return -1;
}

/** Replace inner HTML of the div whose opening tag ends at innerStart (balanced </div>). */
function replaceBalancedDivInner(html, innerStart, newInner) {
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
        return html.slice(0, innerStart) + newInner + html.slice(i + 6);
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

function replaceDivInnerById(html, idValue, inner) {
  const innerStart = findDivOpenEndIndex(html, idValue);
  if (innerStart === -1) return null;
  return replaceBalancedDivInner(html, innerStart, inner);
}

function injectStaticFallback(html, shell) {
  const shellRe = /<!--CRAWL_SHELL_START-->[\s\S]*?<!--CRAWL_SHELL_END-->/;
  if (shellRe.test(html)) {
    return html.replace(
      shellRe,
      `<!--CRAWL_SHELL_START-->${shell}<!--CRAWL_SHELL_END-->`,
    );
  }

  const id = escapeRegExp(FALLBACK_ID);
  const emptyPatterns = [
    new RegExp(`<div\\b[^>]*\\bid\\s*=\\s*"${id}"[^>]*>\\s*</div>`, 'i'),
    new RegExp(`<div\\b[^>]*\\bid\\s*=\\s*'${id}'[^>]*>\\s*</div>`, 'i'),
    new RegExp(`<div\\b[^>]*\\bid\\s*=\\s*${id}\\b[^>]*>\\s*</div>`, 'i'),
  ];
  for (const emptyRe of emptyPatterns) {
    if (emptyRe.test(html)) {
      return html.replace(emptyRe, (m) =>
        m.replace(/>\s*<\/div>\s*$/i, `>${shell}</div>`),
      );
    }
  }

  if (html.includes(FALLBACK_ID) && html.includes('crawl-fallback')) {
    const next = replaceDivInnerById(html, FALLBACK_ID, shell);
    if (next) return next;
  }

  if (html.includes(FALLBACK_ID)) {
    const next = replaceDivInnerById(html, FALLBACK_ID, shell);
    if (next) return next;
  }

  // Template missing on CI / old cache: insert before #root
  const rootRe =
    /<div\b[^>]*\bid\s*=\s*(["'])root\1[^>]*>|<div\b[^>]*\bid\s*=\s*root\b[^>]*>/i;
  const rm = rootRe.exec(html);
  if (rm) {
    const block = `<div id="${FALLBACK_ID}" class="static-storefront-fallback">${shell}</div>`;
    return html.slice(0, rm.index) + block + html.slice(rm.index);
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

  const nsMin = new RegExp(
    '(<div\\b[^>]*class="crawl-fallback-noscript"[^>]*>[\\s\\S]*?<p><strong>Paavan Retail GmbH</strong>[^<]*</p>)' +
      '([\\s\\S]*?)' +
      '(</div>\\s*</noscript>)',
    'i',
  );
  if (nsMin.test(html)) {
    return html.replace(nsMin, `$1${noscript}$3`);
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
    if (isBuild) process.exit(0);
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
      'inject-crawler-html: could not inject storefront fallback (no #root / #static-storefront-fallback).',
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
