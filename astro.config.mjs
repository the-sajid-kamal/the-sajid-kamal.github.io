// Astro configuration. You normally don't need to change anything here:
// your name, links and colours live in src/site.config.ts.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// Articles still marked "placeholder: true" are left out of the sitemap
const unfinished = readdirSync('./src/content/writing')
  .filter((f) => f.endsWith('.md'))
  .filter((f) => /^placeholder:\s*true\s*$/m.test(readFileSync(`./src/content/writing/${f}`, 'utf8').split(/^---$/m)[1] ?? ''))
  .map((f) => `/writing/${f.replace(/\.md$/, '')}/`);

export default defineConfig({
  site: 'https://thesajidkamal.me',
  // Keep Astro 6 whitespace behaviour so spaces between links and words never disappear
  compressHTML: true,
  // Put the styles inside each page: one less download before anything shows
  build: { inlineStylesheets: 'always' },
  integrations: [
    sitemap({ filter: (page) => !page.includes('/404') && !unfinished.some((path) => page.endsWith(path)) }),
  ],
});
