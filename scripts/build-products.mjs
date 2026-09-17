// Generates one static HTML page per product under /products from data/products.mjs.
// Run with `npm run generate:products`. Runs automatically before `dev` and `build`.
// To add a product: add an entry to PRODUCTS in data/products.mjs and re-run.

import { writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRODUCTS, CATEGORIES } from '../data/products.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'products');

const PRODUCTION_NOTE = 'All products are supplied through trusted Turkish manufacturing partners with hospitality-focused production standards. Customized production, private labeling, and bulk supply solutions are available upon request.';

const esc = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function splitName(name) {
  const parts = name.split(' – ');
  if (parts.length === 2) return { base: parts[0], suffix: parts[1] };
  return { base: name, suffix: '' };
}

function heroTitle(name) {
  const { base, suffix } = splitName(name);
  return suffix ? `${esc(base)} <em>${esc(suffix)}</em>` : esc(base);
}

function quoteLink(product, depth) {
  const prefix = depth === 0 ? '' : '../';
  const params = new URLSearchParams({ product: product.name, category: CATEGORIES[product.category].formCategory });
  return `${prefix}get-a-quote.html?${params.toString()}`;
}

function galleryHtml(product) {
  const main = product.main
    ? `<div class="pdp-gallery-main" style="background-image:url('${esc(product.main)}')" role="img" aria-label="${esc(product.name)}"></div>`
    : `<div class="pdp-gallery-main pdp-gallery-placeholder" role="img" aria-label="${esc(product.name)} — photo coming soon"><span>Photo coming soon</span></div>`;
  const extras = product.gallery.filter((url) => url !== product.main);
  if (!extras.length) return `<div class="pdp-gallery">${main}</div>`;
  const thumbs = extras.slice(0, 4).map((url) => `<span style="background-image:url('${esc(url)}')"></span>`).join('');
  return `<div class="pdp-gallery">${main}<div class="pdp-gallery-thumbs">${thumbs}</div></div>`;
}

function specTableHtml(product) {
  const cat = CATEGORIES[product.category];
  return `<dl class="spec-table">` +
    `<div class="spec-row"><dt>Category</dt><dd>${esc(cat.label)}</dd></div>` +
    `<div class="spec-row"><dt>Material</dt><dd>${esc(product.material)}</dd></div>` +
    `<div class="spec-row"><dt>${esc(product.specLabel)}</dt><dd>${esc(product.specValues.join(' / '))}</dd></div>` +
    `<div class="spec-row"><dt>Suitable For</dt><dd>${esc(product.suitableFor)}</dd></div>` +
    `<div class="spec-row"><dt>Customization</dt><dd><ul class="chip-list">${product.customization.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></dd></div>` +
    `</dl>`;
}

function relatedHtml(product) {
  const related = PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);
  if (!related.length) return '';
  const cards = related.map((p) => p.main
    ? `<a class="related-card" href="${p.slug}.html" style="--card-image:url('${esc(p.main)}')"><span>${esc(p.name)}</span></a>`
    : `<a class="related-card related-card-placeholder" href="${p.slug}.html"><span>${esc(p.name)}</span></a>`).join('');
  return `<section class="pdp-related wrap"><p class="eyebrow">YOU MAY ALSO LIKE</p><h2>More from <em>${esc(CATEGORIES[product.category].label)}.</em></h2><div class="related-grid">${cards}</div></section>`;
}

function pageHtml(product) {
  const cat = CATEGORIES[product.category];
  const metaDescription = esc(`${product.overview.slice(0, 145).trim()}… Request a tailored quote from HADARA Hospitality.`);
  const cta = quoteLink(product, 1);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#1e2a38" />
  <meta name="description" content="${metaDescription}" />
  <title>${esc(product.name)} | HADARA Hospitality</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../styles.css" />
</head>
<body>
  <div class="announcement">ISTANBUL, TÜRKIYE <span>✦</span> HOTEL TEXTILE PROCUREMENT & SUPPLY</div>
  <header class="site-header" id="top">
    <a class="brand" href="../index.html" aria-label="HADARA Hospitality home"><span class="brand-mark">H</span><span><strong>HADARA</strong><small>HOSPITALITY</small></span></a>
    <button class="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="navigation"><span></span><span></span><span></span></button>
    <nav id="navigation" aria-label="Main navigation"><a href="../products.html" aria-current="page">Products</a><a href="../index.html#approach">Our approach</a><a href="../index.html#process">How it works</a><a href="../about.html">About us</a><a href="../blog.html">Blog</a><a class="nav-quote" href="../get-a-quote.html">Request a quote <span>↗</span></a></nav>
  </header>
  <main>
    <section class="pdp-hero"><div class="wrap"><p class="breadcrumb"><a href="../products.html">Products</a><span>/</span><a href="../products.html#${product.category}">${esc(cat.label)}</a><span>/</span>${esc(product.name)}</p><p class="eyebrow light">${esc(cat.label.toUpperCase())}</p><h1>${heroTitle(product.name)}</h1><p class="pdp-tagline">${esc(product.overview)}</p><a class="button button-gold" href="${cta}">Request a quote for this product <span>↗</span></a></div></section>
    <section class="pdp-main wrap">${galleryHtml(product)}<div class="pdp-info"><p class="eyebrow">OVERVIEW</p><h2>Built for <em>hospitality use.</em></h2><div class="pdp-quickfacts"><span><strong>Material</strong>${esc(product.material)}</span><span><strong>Category</strong>${esc(cat.label)}</span><span><strong>Suitable for</strong>${esc(product.suitableFor)}</span></div><ul class="pdp-features">${product.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul><a class="text-link" href="${cta}">Request a quote for this product <span>↗</span></a></div></section>
    <section class="pdp-specs"><div class="wrap"><p class="eyebrow">SPECIFICATIONS</p><h2>Technical <em>details.</em></h2>${specTableHtml(product)}<div class="info-box"><strong>Production & Supply</strong>${esc(PRODUCTION_NOTE)}</div></div></section>
    ${relatedHtml(product)}
    <section class="products-cta"><div class="wrap"><div><p class="eyebrow light">SOURCING SUPPORT</p><h2>Looking for a particular<br><em>specification?</em></h2></div><a class="button button-gold" href="${cta}">Request a tailored quote <span>↗</span></a></div></section>
  </main>
  <footer><div class="wrap footer-grid"><div><a class="brand footer-brand" href="../index.html"><span class="brand-mark">H</span><span><strong>HADARA</strong><small>HOSPITALITY</small></span></a><p>Hospitality procurement & supply solutions from Türkiye.</p></div><div><h4>EXPLORE</h4><a href="../products.html">Products</a><a href="../blog.html">Blog</a><a href="../about.html">About us</a></div><div><h4>GET IN TOUCH</h4><a href="../get-a-quote.html">Request a quote</a><a href="mailto:partnerships@hadarahospitality.com">Email our team</a><span>Istanbul, Türkiye</span></div></div><div class="wrap footer-bottom"><span>© <span id="year">2026</span> HADARA Hospitality · Part of BYHADARA Group</span><a href="#top">Back to top ↑</a></div></footer>
  <script type="module" src="../script.js"></script>
</body>
</html>
`;
}

mkdirSync(OUT_DIR, { recursive: true });

// Remove stale generated pages for products that no longer exist in data/products.mjs.
const currentSlugs = new Set(PRODUCTS.map((p) => `${p.slug}.html`));
if (existsSync(OUT_DIR)) {
  for (const file of readdirSync(OUT_DIR)) {
    if (file.endsWith('.html') && !currentSlugs.has(file)) unlinkSync(resolve(OUT_DIR, file));
  }
}

for (const product of PRODUCTS) {
  writeFileSync(resolve(OUT_DIR, `${product.slug}.html`), pageHtml(product));
}

console.log(`Generated ${PRODUCTS.length} product pages in /products`);
