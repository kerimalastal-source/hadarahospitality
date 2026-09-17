import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { existsSync, readdirSync } from 'node:fs';

const root = import.meta.dirname;

function pageEntries(dirName, prefix) {
  const dir = resolve(root, dirName);
  if (!existsSync(dir)) return {};
  return Object.fromEntries(
    readdirSync(dir)
      .filter((file) => file.endsWith('.html'))
      .map((file) => [`${prefix}-${file.replace('.html', '')}`, resolve(dir, file)]),
  );
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        about: resolve(root, 'about.html'),
        products: resolve(root, 'products.html'),
        blog: resolve(root, 'blog.html'),
        quote: resolve(root, 'get-a-quote.html'),
        contact: resolve(root, 'contact.html'),
        faq: resolve(root, 'faq.html'),
        privacy: resolve(root, 'privacy-policy.html'),
        search: resolve(root, 'search.html'),
        notFound: resolve(root, '404.html'),
        ...pageEntries('products', 'product'),
        ...pageEntries('blog', 'article'),
      },
    },
  },
});
