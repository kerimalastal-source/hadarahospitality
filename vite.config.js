import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { existsSync, readdirSync } from 'node:fs';

const root = import.meta.dirname;
const productsDir = resolve(root, 'products');
const productEntries = existsSync(productsDir)
  ? Object.fromEntries(
      readdirSync(productsDir)
        .filter((file) => file.endsWith('.html'))
        .map((file) => [`product-${file.replace('.html', '')}`, resolve(productsDir, file)]),
    )
  : {};

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        about: resolve(root, 'about.html'),
        products: resolve(root, 'products.html'),
        ...productEntries,
      },
    },
  },
});
