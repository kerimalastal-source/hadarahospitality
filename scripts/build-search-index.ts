// Generates public/search-index.json: a flat list of every product, blog
// article and static page for the client-side search on search.
// Run with `npm run generate:search`. Runs automatically before `dev`/`build`.
// Output is gitignored — it is rebuilt on every install/deploy, never hand-edited.

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRODUCTS, CATEGORIES } from '../src/data/products.ts';
import { ARTICLES } from '../src/data/blog.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const staticPages = [
  { type: 'Page', title: 'Home', url: '/index', excerpt: 'HADARA Hospitality — hotel textiles and guest essentials from Türkiye.' },
  { type: 'Page', title: 'About Us', url: '/about', excerpt: 'Learn about HADARA Hospitality, an Istanbul-based hotel textile and guest essentials supply company.' },
  { type: 'Page', title: 'Products & Collections', url: '/products', excerpt: 'Explore HADARA Hospitality collections: bed linen, towels, bathrobes, slippers, pillows, duvets, mattress protectors and guest amenities.' },
  { type: 'Page', title: 'Blog', url: '/blog', excerpt: 'Insights on hotel textiles, guest amenities and hospitality procurement.' },
  { type: 'Page', title: 'Get a Quote', url: '/get-a-quote', excerpt: 'Request a tailored quote for hotel textiles and guest essentials.' },
  { type: 'Page', title: 'Hotel Opening Package', url: '/hotel-opening-package', excerpt: 'Every guest textile category for a new hotel opening — bed linen, towels, robes, pillows, mattress protection and amenities — through one request.' },
  { type: 'Page', title: 'GSM & Thread Count Guide', url: '/fabric-quality-guide', excerpt: 'What GSM means for hotel towels and what thread count means for hotel bed linen — a visual guide to fabric quality tiers.' },
  { type: 'Page', title: 'Contact', url: '/contact', excerpt: 'Contact HADARA Hospitality in Beylikdüzü, Istanbul, Türkiye.' },
  { type: 'Page', title: 'FAQ', url: '/faq', excerpt: 'Common questions about minimum order quantities, samples, customization, shipping and payment.' },
];

const products = PRODUCTS.map((p) => ({
  type: 'Product',
  title: p.name,
  url: `/products/${p.slug}`,
  excerpt: p.overview,
  category: CATEGORIES[p.category].label,
}));

const articles = ARTICLES.map((a) => ({
  type: 'Article',
  title: a.title,
  url: `/blog/${a.slug}`,
  excerpt: a.excerpt,
  category: a.category,
}));

const index = [...staticPages, ...products, ...articles];

mkdirSync(resolve(ROOT, 'public'), { recursive: true });
writeFileSync(resolve(ROOT, 'public', 'search-index.json'), JSON.stringify(index));
console.log(`Generated search-index.json with ${index.length} entries`);
