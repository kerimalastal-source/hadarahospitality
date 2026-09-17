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
        ...pageEntries('products', 'product'),
        ...pageEntries('blog', 'article'),
      },
    },
  },
});
