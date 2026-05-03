// Usage:
//   node scripts/fetch-posters.mjs           # fill in missing TMDB posters
//   node scripts/fetch-posters.mjs --force   # refresh ALL TMDB poster URLs
//
// Recommended: add TMDB_API_KEY=<key> to .env for stable results.
// The API returns exact poster_path values; without a key the script
// falls back to scraping og:image which can return unrelated images.
// Free key: https://www.themoviedb.org/settings/api

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const FORCE = process.argv.includes('--force');
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FILE = join(ROOT, 'src', 'data', 'favorites.ts');

// ── Load .env ─────────────────────────────────────────────────────────────────
const envFile = join(ROOT, '.env');
if (existsSync(envFile)) {
  for (const line of (await readFile(envFile, 'utf8')).split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (m) process.env[m[1]] ??= m[2].trim().replace(/^["']|["']$/g, '');
  }
}

const TMDB_API_KEY = process.env.TMDB_API_KEY ?? '';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0 Safari/537.36';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Extract { type:'movie'|'tv', id:'123' } from any TMDB URL. */
function parseTmdbUrl(url) {
  const m = url.match(/themoviedb\.org\/(movie|tv)\/(\d+)/);
  return m ? { type: m[1], id: m[2] } : null;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Fetch poster URL via TMDB API v3 — the reliable path.
 * Returns `https://image.tmdb.org/t/p/w500<poster_path>`.
 */
async function posterFromApi(type, id) {
  const url =
    `https://api.themoviedb.org/3/${type}/${id}` +
    `?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`TMDB API ${res.status}: ${body.slice(0, 120)}`);
  }
  const data = await res.json();
  if (!data.poster_path) throw new Error(`poster_path missing for ${type}/${id}`);
  return `https://image.tmdb.org/t/p/w500${data.poster_path}`;
}

/**
 * Fallback: scrape og:image from the TMDB page.
 * Less reliable — TMDB sometimes serves promotional / unrelated images here.
 */
async function posterFromOgImage(link) {
  const res = await fetch(link, {
    headers: { 'user-agent': UA, accept: 'text/html' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const m =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (!m) throw new Error('og:image not found in page');
  return m[1];
}

async function fetchPoster(link) {
  const tmdb = parseTmdbUrl(link);
  if (!tmdb) throw new Error('Not a TMDB URL');
  return TMDB_API_KEY
    ? posterFromApi(tmdb.type, tmdb.id)
    : posterFromOgImage(link);
}

// ── Collect tasks ─────────────────────────────────────────────────────────────

const src = await readFile(FILE, 'utf8');

// Find every JS object literal that has a TMDB link.
// We match `{ ... }` blocks (non-nested) and inspect their fields.
const tasks = [];

for (const m of src.matchAll(/\{([^{}]+)\}/gs)) {
  const body = m[1];
  const linkM = body.match(/link:\s*['"]([^'"]*themoviedb\.org[^'"]*)['"]/);
  if (!linkM) continue;

  const posterM = body.match(/poster:\s*['"]([^'"]+)['"]/);
  const titleM = body.match(/title:\s*['"]([^'"]+)['"]/);

  // In force mode refresh any TMDB URL poster; a Cloudinary ID (no "://") is left alone.
  const hasTmdbPoster = posterM && /^https?:\/\//.test(posterM[1]);

  if (posterM && !hasTmdbPoster) continue; // Cloudinary ID — never overwrite
  if (posterM && !FORCE) continue;         // already has a URL poster, skip unless --force

  tasks.push({
    link: linkM[1],
    currentPoster: posterM ? posterM[1] : null,
    title: titleM ? titleM[1] : linkM[1],
  });
}

if (tasks.length === 0) {
  console.log(
    FORCE
      ? 'No TMDB-linked items found in favorites.ts.'
      : 'All TMDB items already have poster URLs. Run with --force to refresh them.',
  );
  process.exit(0);
}

if (!TMDB_API_KEY) {
  console.warn('⚠  TMDB_API_KEY not set — using og:image scraping (unreliable).');
  console.warn('   Add TMDB_API_KEY=<key> to .env for stable poster paths.');
  console.warn('   Free key: https://www.themoviedb.org/settings/api\n');
} else {
  console.log(`✓  Using TMDB API (key ending …${TMDB_API_KEY.slice(-4)})\n`);
}

console.log(`${FORCE ? 'Refreshing' : 'Fetching'} poster for ${tasks.length} item(s)…\n`);

// ── Fetch & patch ─────────────────────────────────────────────────────────────

let result = src;
let updated = 0;
let unchanged = 0;
const failed = [];

for (const task of tasks) {
  try {
    const poster = await fetchPoster(task.link);

    if (task.currentPoster === poster) {
      console.log(`  = ${task.title} (already up to date)`);
      unchanged++;
    } else if (task.currentPoster) {
      // Replace the existing poster value in-place.
      result = result.replace(
        new RegExp(`(poster:\\s*['"])${escapeRe(task.currentPoster)}(['"])`),
        `$1${poster}$2`,
      );
      console.log(`  ✓ ${task.title}`);
      console.log(`      was: ${task.currentPoster}`);
      console.log(`      now: ${poster}`);
      updated++;
    } else {
      // Insert `poster: '...'` on a new line after the link field.
      result = result.replace(
        new RegExp(`(link:\\s*['"]${escapeRe(task.link)}['"],?)`),
        `$1\n        poster: '${poster}',`,
      );
      console.log(`  ✓ ${task.title} → ${poster}`);
      updated++;
    }
  } catch (err) {
    console.warn(`  ✗ ${task.title}: ${err.message}`);
    failed.push(task.title);
  }

  await new Promise((r) => setTimeout(r, 300)); // gentle rate-limit
}

if (updated > 0) {
  await writeFile(FILE, result, 'utf8');
}

console.log('\n── Summary ' + '─'.repeat(35));
console.log(`  Updated:   ${updated}`);
if (unchanged) console.log(`  Unchanged: ${unchanged}`);
if (failed.length) console.log(`  Failed:    ${failed.join(', ')}`);
if (updated === 0 && failed.length === 0) console.log('  Nothing to write.');
