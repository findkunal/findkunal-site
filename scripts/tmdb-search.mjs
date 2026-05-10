// Search TMDB for each item that's missing a link or where the verifier
// flagged a mismatch, and print candidate IDs for manual confirmation.
//
// Usage:
//   node scripts/tmdb-search.mjs "The Straight Story" movie
//   node scripts/tmdb-search.mjs "Berserk 1997" tv

import process from 'node:process';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const query = process.argv[2];
const type = process.argv[3] || 'movie'; // movie | tv
if (!query) {
  console.error('Usage: node scripts/tmdb-search.mjs "<query>" [movie|tv]');
  process.exit(2);
}

const url = `https://www.themoviedb.org/search/${type}?query=${encodeURIComponent(query)}`;
const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' } });
if (!res.ok) {
  console.error(`HTTP ${res.status}`);
  process.exit(1);
}
const html = await res.text();

// TMDB renders results as: <a ... href="/movie/<id>-<slug>"> ... <h2>Title</h2> ... <span>Date</span>
// We grab cards by walking each /TYPE/<id>-... link with its surrounding card.
const cardRe = new RegExp(
  `href="/${type}/(\\d+)-[^"]*"[^>]*>[\\s\\S]*?<h2>([^<]+)</h2>[\\s\\S]*?(?:<span[^>]*>([^<]+)</span>)?`,
  'g',
);

const seen = new Set();
const results = [];
let m;
while ((m = cardRe.exec(html)) !== null) {
  if (seen.has(m[1])) continue;
  seen.add(m[1]);
  results.push({ id: m[1], title: m[2].trim(), date: (m[3] || '').trim() });
  if (results.length >= 8) break;
}

console.log(`Top results for "${query}" (${type}):\n`);
for (const r of results) {
  console.log(
    `  https://www.themoviedb.org/${type}/${r.id}  —  ${r.title}` +
      (r.date ? `  (${r.date})` : ''),
  );
}
if (results.length === 0) console.log('  (no results)');
