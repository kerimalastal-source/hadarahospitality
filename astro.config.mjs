import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hadarahospitality.com',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
