// Generates the blog listing page (blog.html) and one static HTML page per
// article under /blog from data/blog.mjs. Run with `npm run generate:blog`.
// Runs automatically before `dev` and `build`.
// To add an article: add an entry to ARTICLES in data/blog.mjs and re-run.

import { writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARTICLES } from '../data/blog.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'blog');
const SITE_URL = 'https://hadarahospitality.com';

const esc = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

function bodyHtml(article) {
  return article.body.map((block) => {
    if (block.type === 'p') return `<p>${esc(block.text)}</p>`;
    if (block.type === 'h2') return `<h2>${esc(block.text)}</h2>`;
    if (block.type === 'ul') return `<ul>${block.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
    if (block.type === 'image') return `<figure class="article-figure"><img src="${esc(article.inlineImage)}" alt="${esc(article.inlineAlt)}" loading="lazy"></figure>`;
    return '';
  }).join('');
}

function relatedHtml(article) {
  const related = ARTICLES.filter((a) => a.category === article.category && a.slug !== article.slug).slice(0, 3);
  const pool = related.length ? related : ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);
  const cards = pool.map((a) => `<a class="related-card" href="${a.slug}.html" data-bg="${esc(a.hero)}"><span>${esc(a.title)}</span></a>`).join('');
  return `<section class="pdp-related wrap"><p class="eyebrow">YOU MAY ALSO LIKE</p><h2>More from the <em>HADARA journal.</em></h2><div class="related-grid">${cards}</div></section>`;
}

function articlePageHtml(article) {
  const metaDescription = esc(article.excerpt);
  const pageUrl = `${SITE_URL}/blog/${article.slug}.html`;
  const ogImage = article.hero || `${SITE_URL}/assets/og-image.png`;
  const pageTitle = esc(`${article.title} | HADARA Hospitality`);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#1e2a38" />
  <meta name="description" content="${metaDescription}" />
  <title>${pageTitle}</title>
  <link rel="canonical" href="${pageUrl}" />
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon-192.png" />
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="HADARA Hospitality" />
  <meta property="og:title" content="${pageTitle}" />
  <meta property="og:description" content="${metaDescription}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:image" content="${esc(ogImage)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pageTitle}" />
  <meta name="twitter:description" content="${metaDescription}" />
  <meta name="twitter:image" content="${esc(ogImage)}" />
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
    <nav id="navigation" aria-label="Main navigation"><a href="../products.html">Products</a><a href="../index.html#approach">Our approach</a><a href="../about.html">About us</a><a href="../blog.html" aria-current="page">Blog</a><a href="../contact.html">Contact</a><a class="nav-quote" href="../get-a-quote.html">Request a quote <span>↗</span></a></nav>
  </header>
  <main>
    <section class="pdp-hero"><div class="wrap"><p class="breadcrumb"><a href="../blog.html">Blog</a><span>/</span>${esc(article.title)}</p><p class="eyebrow light">${esc(article.category.toUpperCase())}</p><h1>${esc(article.title)}</h1><p class="article-meta-line">${formatDate(article.date)} <span>·</span> ${esc(article.readTime)} <span>·</span> HADARA Hospitality Team</p></div></section>
    <figure class="article-cover-figure"><img class="article-cover" src="${esc(article.hero)}" alt="${esc(article.heroAlt)}"></figure>
    <article class="article-body wrap">${bodyHtml(article)}</article>
    <section class="products-cta"><div class="wrap"><div><p class="eyebrow light">SOURCING SUPPORT</p><h2>Ready to talk about<br><em>your property?</em></h2></div><a class="button button-gold" href="../get-a-quote.html">Request a tailored quote <span>↗</span></a></div></section>
    ${relatedHtml(article)}
  </main>
  <footer><div class="wrap footer-grid"><div><a class="brand footer-brand" href="../index.html"><span class="brand-mark">H</span><span><strong>HADARA</strong><small>HOSPITALITY</small></span></a><p>Hospitality procurement & supply solutions from Türkiye.</p></div><div><h4>EXPLORE</h4><a href="../products.html">Products</a><a href="../blog.html">Blog</a><a href="../about.html">About us</a></div><div><h4>GET IN TOUCH</h4><a href="../contact.html">Contact us</a><a href="../get-a-quote.html">Request a quote</a><a href="mailto:partnerships@hadarahospitality.com">Email our team</a><span>Istanbul, Türkiye</span></div></div><div class="wrap footer-bottom"><span>© <span id="year">2026</span> HADARA Hospitality · Part of BYHADARA Group</span><a href="#top">Back to top ↑</a></div></footer>
  <script type="module" src="../script.js"></script>
</body>
</html>
`;
}

function blogListingHtml() {
  const cards = ARTICLES.map((a) => `<a class="blog-card" href="blog/${a.slug}.html"><div class="blog-card-image" data-bg="${esc(a.hero)}" role="img" aria-label="${esc(a.heroAlt)}"></div><div class="blog-card-body"><span class="blog-tag">${esc(a.category)}</span><h3>${esc(a.title)}</h3><p>${esc(a.excerpt)}</p><span class="blog-meta">${formatDate(a.date)} <span>·</span> ${esc(a.readTime)}</span><span class="text-link">Read article <span>↗</span></span></div></a>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#1e2a38" />
  <meta name="description" content="Insights on hotel textiles, guest amenities and hospitality procurement from HADARA Hospitality, hotel textile suppliers based in Istanbul, Türkiye." />
  <title>Blog | HADARA Hospitality</title>
  <link rel="canonical" href="${SITE_URL}/blog.html" />
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon-192.png" />
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="HADARA Hospitality" />
  <meta property="og:title" content="Blog | HADARA Hospitality" />
  <meta property="og:description" content="Insights on hotel textiles, guest amenities and hospitality procurement from HADARA Hospitality, hotel textile suppliers based in Istanbul, Türkiye." />
  <meta property="og:url" content="${SITE_URL}/blog.html" />
  <meta property="og:image" content="${SITE_URL}/assets/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Blog | HADARA Hospitality" />
  <meta name="twitter:description" content="Insights on hotel textiles, guest amenities and hospitality procurement from HADARA Hospitality, hotel textile suppliers based in Istanbul, Türkiye." />
  <meta name="twitter:image" content="${SITE_URL}/assets/og-image.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="announcement">ISTANBUL, TÜRKIYE <span>✦</span> HOTEL TEXTILE PROCUREMENT & SUPPLY</div>
  <header class="site-header" id="top">
    <a class="brand" href="index.html" aria-label="HADARA Hospitality home"><span class="brand-mark">H</span><span><strong>HADARA</strong><small>HOSPITALITY</small></span></a>
    <button class="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="navigation"><span></span><span></span><span></span></button>
    <nav id="navigation" aria-label="Main navigation"><a href="products.html">Products</a><a href="index.html#approach">Our approach</a><a href="about.html">About us</a><a href="blog.html" aria-current="page">Blog</a><a href="contact.html">Contact</a><a class="nav-quote" href="get-a-quote.html">Request a quote <span>↗</span></a></nav>
  </header>
  <main>
    <section class="products-hero"><div class="wrap"><p class="eyebrow light">THE HADARA JOURNAL</p><h1>Notes on <em>hospitality supply.</em></h1><p>Practical guidance on hotel textiles, guest amenities and sourcing, from our team in Istanbul.</p></div></section>
    <section class="blog-list wrap"><div class="blog-grid">${cards}</div></section>
    <section class="products-cta"><div class="wrap"><div><p class="eyebrow light">SOURCING SUPPORT</p><h2>Have a question for<br><em>our team?</em></h2></div><a class="button button-gold" href="get-a-quote.html">Request a tailored quote <span>↗</span></a></div></section>
  </main>
  <footer><div class="wrap footer-grid"><div><a class="brand footer-brand" href="index.html"><span class="brand-mark">H</span><span><strong>HADARA</strong><small>HOSPITALITY</small></span></a><p>Hospitality procurement & supply solutions from Türkiye.</p></div><div><h4>EXPLORE</h4><a href="products.html">Products</a><a href="blog.html">Blog</a><a href="about.html">About us</a></div><div><h4>GET IN TOUCH</h4><a href="contact.html">Contact us</a><a href="get-a-quote.html">Request a quote</a><a href="mailto:partnerships@hadarahospitality.com">Email our team</a><span>Istanbul, Türkiye</span></div></div><div class="wrap footer-bottom"><span>© <span id="year">2026</span> HADARA Hospitality · Part of BYHADARA Group</span><a href="#top">Back to top ↑</a></div></footer>
  <script type="module" src="script.js"></script>
</body>
</html>
`;
}

mkdirSync(OUT_DIR, { recursive: true });

const currentSlugs = new Set(ARTICLES.map((a) => `${a.slug}.html`));
if (existsSync(OUT_DIR)) {
  for (const file of readdirSync(OUT_DIR)) {
    if (file.endsWith('.html') && !currentSlugs.has(file)) unlinkSync(resolve(OUT_DIR, file));
  }
}

for (const article of ARTICLES) {
  writeFileSync(resolve(OUT_DIR, `${article.slug}.html`), articlePageHtml(article));
}
writeFileSync(resolve(ROOT, 'blog.html'), blogListingHtml());

console.log(`Generated blog.html and ${ARTICLES.length} article pages in /blog`);
