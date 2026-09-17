// Generates public/search-index.json: a flat list of every product, blog
// article and static page for the client-side search on search.html.
// Run with `npm run generate:search`. Runs automatically before `dev`/`build`.

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRODUCTS, CATEGORIES } from '../data/products.mjs';
import { ARTICLES } from '../data/blog.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const staticPages = [
  { type: 'Page', title: 'Home', url: '/index.html', excerpt: 'HADARA Hospitality — hotel textiles and guest essentials from Türkiye.' },
  { type: 'Page', title: 'About Us', url: '/about.html', excerpt: 'Learn about HADARA Hospitality, an Istanbul-based hotel textile and guest essentials supply company.' },
  { type: 'Page', title: 'Products & Collections', url: '/products.html', excerpt: 'Explore HADARA Hospitality collections: bed linen, towels, bathrobes, slippers, pillows, duvets, mattress protectors and guest amenities.' },
  { type: 'Page', title: 'Blog', url: '/blog.html', excerpt: 'Insights on hotel textiles, guest amenities and hospitality procurement.' },
  { type: 'Page', title: 'Get a Quote', url: '/get-a-quote.html', excerpt: 'Request a tailored quote for hotel textiles and guest essentials.' },
  { type: 'Page', title: 'Contact', url: '/contact.html', excerpt: 'Contact HADARA Hospitality in Beylikdüzü, Istanbul, Türkiye.' },
  { type: 'Page', title: 'FAQ', url: '/faq.html', excerpt: 'Common questions about minimum order quantities, samples, customization, shipping and payment.' },
];

const products = PRODUCTS.map((p) => ({
  type: 'Product',
  title: p.name,
  url: `/products/${p.slug}.html`,
  excerpt: p.overview,
  category: CATEGORIES[p.category].label,
}));

const articles = ARTICLES.map((a) => ({
  type: 'Article',
  title: a.title,
  url: `/blog/${a.slug}.html`,
  excerpt: a.excerpt,
  category: a.category,
}));

const index = [...staticPages, ...products, ...articles];

mkdirSync(resolve(ROOT, 'public'), { recursive: true });
writeFileSync(resolve(ROOT, 'public', 'search-index.json'), JSON.stringify(index));
console.log(`Generated search-index.json with ${index.length} entries`);
