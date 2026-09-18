import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import clerk from '@clerk/astro';

export default defineConfig({
  site: 'https://www.hadarahospitality.com',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  adapter: vercel(),
  integrations: [clerk()],
});
