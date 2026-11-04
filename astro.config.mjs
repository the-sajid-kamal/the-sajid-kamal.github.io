// Astro configuration. You normally don't need to change anything here:
// your name, links and colours live in src/site.config.ts.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://thesajidkamal.me',
  // Keep Astro 6 whitespace behaviour so spaces between links and words never disappear
  compressHTML: true,
  integrations: [
    sitemap({ filter: (page) => !page.includes('/404') }),
  ],
});
