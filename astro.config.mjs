import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.hadarahospitality.com',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
