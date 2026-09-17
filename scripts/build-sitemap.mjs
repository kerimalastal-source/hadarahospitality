// Generates public/sitemap.xml from the static pages plus every product and
// blog article in data/products.mjs and data/blog.mjs. Run with
// `npm run generate:sitemap`. Runs automatically before `dev` and `build`.

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRODUCTS } from '../data/products.mjs';
import { ARTICLES } from '../data/blog.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://hadarahospitality.com';
const today = new Date().toISOString().slice(0, 10);

const staticPages = [
  { path: '/', priority: '1.0' },
  { path: '/about.html', priority: '0.7' },
  { path: '/products.html', priority: '0.9' },
  { path: '/blog.html', priority: '0.7' },
  { path: '/get-a-quote.html', priority: '0.8' },
  { path: '/contact.html', priority: '0.6' },
  { path: '/faq.html', priority: '0.6' },
  { path: '/privacy-policy.html', priority: '0.3' },
];

const urls = [
  ...staticPages.map((p) => ({ loc: `${SITE_URL}${p.path}`, priority: p.priority })),
  ...PRODUCTS.map((p) => ({ loc: `${SITE_URL}/products/${p.slug}.html`, priority: '0.6' })),
  ...ARTICLES.map((a) => ({ loc: `${SITE_URL}/blog/${a.slug}.html`, priority: '0.5', lastmod: a.date })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod || today}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}
</urlset>
`;

mkdirSync(resolve(ROOT, 'public'), { recursive: true });
writeFileSync(resolve(ROOT, 'public', 'sitemap.xml'), xml);
console.log(`Generated sitemap.xml with ${urls.length} URLs`);
