// Makes public/Sajid-Kamal-One-Pager.pdf from the /one-pager/ page.
// Run after building:   npm run build && npm run pdf
// It needs Playwright's browser once:   npx playwright install chromium
// (Or open /one-pager/ in Chrome, press Print and choose "Save as PDF".)
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readFile, copyFile, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const root = resolve('dist');
const target = resolve('public/Sajid-Kamal-One-Pager.pdf');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf' };

let chromium;
try { ({ chromium } = createRequire(import.meta.url)('playwright')); }
catch { console.error('Playwright is not installed. Run: npm install --no-save playwright && npx playwright install chromium'); process.exit(1); }
try { await stat(join(root, 'one-pager/index.html')); }
catch { console.error('Build the site first: npm run build'); process.exit(1); }

const server = createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path.endsWith('/')) path += 'index.html';
  try {
    const body = await readFile(join(root, path));
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' }).end(body);
  } catch { res.writeHead(404).end(); }
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage();
// Analytics never run here: block them just in case
await page.route(/googletagmanager|clarity\.ms|umami\.is|cloudflareinsights|facebook|licdn/, (r) => r.abort());
await page.goto(`http://localhost:${port}/one-pager/`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: target, format: 'A4', printBackground: true, preferCSSPageSize: true });
await browser.close();
server.close();
await copyFile(target, join(root, 'Sajid-Kamal-One-Pager.pdf'));
const { size } = await stat(target);
console.log(`public/Sajid-Kamal-One-Pager.pdf: ${(size / 1024).toFixed(0)} KB (also copied into dist/)`);
