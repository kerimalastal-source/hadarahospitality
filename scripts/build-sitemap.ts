// Generates public/sitemap.xml from the static pages plus every product and
// blog article in src/data/products.ts and src/data/blog.ts, for every locale.
// Run with `npm run generate:sitemap`. Runs automatically before `dev`/`build`.
// Output is gitignored — it is rebuilt on every install/deploy, never hand-edited.

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRODUCTS } from '../src/data/products.ts';
import { ARTICLES } from '../src/data/blog.ts';
import { SITE_URL } from '../src/config.ts';
import { LOCALES, LOCALE_TAGS, DEFAULT_LOCALE, localizePath, type Locale } from '../src/i18n/locales.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const today = new Date().toISOString().slice(0, 10);

const staticPages = [
  { path: '/', priority: '1.0' },
  { path: '/about', priority: '0.7' },
  { path: '/products', priority: '0.9' },
  { path: '/blog', priority: '0.7' },
  { path: '/get-a-quote', priority: '0.8' },
  { path: '/hotel-opening-package', priority: '0.8' },
  { path: '/fabric-quality-guide', priority: '0.6' },
  { path: '/contact', priority: '0.6' },
  { path: '/faq', priority: '0.6' },
  { path: '/privacy-policy', priority: '0.3' },
];

interface Entry {
  path: string;
  priority: string;
  lastmod?: string;
}

const entries: Entry[] = [
  ...staticPages,
  ...PRODUCTS.map((p) => ({ path: `/products/${p.slug}`, priority: '0.6' })),
  ...ARTICLES.map((a) => ({ path: `/blog/${a.slug}`, priority: '0.5', lastmod: a.date })),
];

function alternateLinks(path: string): string {
  const links = LOCALES.map(
    (l) => `\n    <xhtml:link rel="alternate" hreflang="${LOCALE_TAGS[l]}" href="${SITE_URL}${localizePath(l, path)}" />`,
  ).join('');
  return `${links}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${localizePath(DEFAULT_LOCALE, path)}" />`;
}

const urls = LOCALES.flatMap((locale: Locale) =>
  entries.map(
    (e) =>
      `  <url>\n    <loc>${SITE_URL}${localizePath(locale, e.path)}</loc>${alternateLinks(e.path)}\n    <lastmod>${e.lastmod || today}</lastmod>\n    <priority>${e.priority}</priority>\n  </url>`,
  ),
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

mkdirSync(resolve(ROOT, 'public'), { recursive: true });
writeFileSync(resolve(ROOT, 'public', 'sitemap.xml'), xml);
console.log(`Generated sitemap.xml with ${urls.length} URLs across ${LOCALES.length} locales`);
