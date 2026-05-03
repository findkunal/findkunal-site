// One-shot script: for every favorite item with a themoviedb.org link
// but no `poster`, fetch the page, scrape <meta property="og:image">,
// and write the URL back into src/data/favorites.ts.
//
// Usage: node scripts/fetch-posters.mjs

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, '..', 'src', 'data', 'favorites.ts');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function fetchPoster(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const html = await res.text();
  const match =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (!match) throw new Error(`No og:image in ${url}`);
  // TMDB serves og:image as image.tmdb.org/t/p/w500/xxx.jpg — keep as-is.
  return match[1];
}

const src = await readFile(FILE, 'utf8');

// Match each item object: { ...title... link: 'https://www.themoviedb.org/...' ... }
// We rewrite items that have a TMDB link but no poster.
const itemRe = /\{\s*([^{}]*?)\s*\},/gs;
let updated = 0;
const skipped = [];

const out = src.replace(itemRe, (block, body) => {
  const linkMatch = body.match(/link:\s*['"]([^'"]+themoviedb\.org\/[^'"]+)['"]/);
  if (!linkMatch) return block;
  if (/poster:\s*['"]/.test(body)) return block; // already has poster
  const link = linkMatch[1];
  const titleMatch = body.match(/title:\s*['"]([^'"]+)['"]/);
  const title = titleMatch ? titleMatch[1] : link;
  // Mark this block for async processing by leaving a placeholder.
  return `__POSTER_PLACEHOLDER__${encodeURIComponent(JSON.stringify({ link, title }))}__${block}`;
});

// Collect placeholders, fetch, and replace.
const tasks = [...out.matchAll(/__POSTER_PLACEHOLDER__([^_]+)__/g)].map((m) => {
  const meta = JSON.parse(decodeURIComponent(m[1]));
  return { token: m[0], ...meta };
});

if (tasks.length === 0) {
  console.log('No TMDB-linked items missing posters. Nothing to do.');
  process.exit(0);
}

console.log(`Fetching posters for ${tasks.length} item(s)…`);

const results = new Map();
for (const t of tasks) {
  try {
    const poster = await fetchPoster(t.link);
    results.set(t.token, poster);
    console.log(`  ✓ ${t.title} → ${poster}`);
    updated++;
  } catch (err) {
    console.warn(`  ✗ ${t.title}: ${err.message}`);
    skipped.push(t.title);
    results.set(t.token, null);
  }
  // gentle delay
  await new Promise((r) => setTimeout(r, 250));
}

let final = out;
for (const t of tasks) {
  const poster = results.get(t.token);
  if (poster) {
    // Strip the placeholder and inject `poster: '...'` after `link: '...'`
    final = final.replace(t.token, '');
    // The original block follows the placeholder; inject poster after link line.
    final = final.replace(
      new RegExp(
        `(link:\\s*['"]${t.link.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}['"],?)`
      ),
      `$1\n        poster: '${poster}',`
    );
  } else {
    final = final.replace(t.token, '');
  }
}

await writeFile(FILE, final, 'utf8');
console.log(`\nUpdated ${updated} item(s).`);
if (skipped.length) console.log(`Skipped: ${skipped.join(', ')}`);
