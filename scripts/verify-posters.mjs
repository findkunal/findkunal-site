// Verify + fetch TMDB posters for src/data/favorites.ts.
//
// For every item with a themoviedb.org link this script:
//   1. Fetches the TMDB page.
//   2. Extracts <meta property="og:title"> and <meta property="og:image">.
//   3. Compares the page's title (and year) with our local `title`/`year`.
//   4. Writes the poster URL back to favorites.ts only when titles match
//      (or always, if --force is passed).
//   5. Emits poster-preview.html — a single page with every item's
//      title + year + poster + TMDB og:title + link, so mismatches are
//      obvious at a glance.
//
// Usage:
//   node scripts/verify-posters.mjs            # verify + fill missing posters
//   node scripts/verify-posters.mjs --force    # also overwrite existing posters
//   node scripts/verify-posters.mjs --dry      # don't write favorites.ts
//
// Exit code is non-zero if any mismatch is detected.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, '..', 'src', 'data', 'favorites.ts');
const PREVIEW = join(__dirname, '..', 'poster-preview.html');

const FORCE = process.argv.includes('--force');
const DRY = process.argv.includes('--dry');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0 Safari/537.36';

function metaContent(html, prop) {
  const re = new RegExp(
    `<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']|` +
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`,
    'i',
  );
  const m = html.match(re);
  return m ? (m[1] || m[2]) : null;
}

async function fetchTmdb(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  return {
    ogImage: metaContent(html, 'og:image'),
    ogTitle: metaContent(html, 'og:title'),
  };
}

const norm = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // diacritics
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

// TMDB og:title is usually "Title (YYYY)" or "Title (YYYY-MM-DD)" or just "Title".
function parseOgTitle(s) {
  if (!s) return { title: '', year: '' };
  const m = s.match(/^(.*?)(?:\s*\((\d{4})(?:-\d{2}-\d{2})?\))?\s*$/);
  return { title: (m?.[1] || s).trim(), year: m?.[2] || '' };
}

// Local year may be "2022", "2022–", "2022–2023" — take the first 4 digits.
function firstYear(s) {
  const m = (s || '').match(/\d{4}/);
  return m ? m[0] : '';
}

const src = await readFile(FILE, 'utf8');

// Walk each item block. itemRe is greedy-safe because items are flat objects.
const itemRe = /\{\s*([^{}]*?)\s*\}/gs;

const items = [];
let mIter;
while ((mIter = itemRe.exec(src)) !== null) {
  const body = mIter[1];
  const linkMatch = body.match(/link:\s*['"]([^'"]+themoviedb\.org\/[^'"]+)['"]/);
  if (!linkMatch) continue;
  const titleMatch = body.match(/title:\s*['"]([^'"]+)['"]/);
  const yearMatch = body.match(/year:\s*['"]([^'"]+)['"]/);
  const posterMatch = body.match(/poster:\s*['"]([^'"]+)['"]/);
  items.push({
    link: linkMatch[1],
    title: titleMatch ? titleMatch[1] : '(no title)',
    year: yearMatch ? yearMatch[1] : '',
    poster: posterMatch ? posterMatch[1] : '',
    blockStart: mIter.index,
    blockEnd: mIter.index + mIter[0].length,
  });
}

if (items.length === 0) {
  console.log('No TMDB-linked items found.');
  process.exit(0);
}

console.log(`Verifying ${items.length} TMDB item(s)…\n`);

const results = [];
for (const it of items) {
  try {
    const { ogTitle, ogImage } = await fetchTmdb(it.link);
    const { title: pageTitle, year: pageYear } = parseOgTitle(ogTitle);
    const titleOk = norm(pageTitle).includes(norm(it.title)) ||
                    norm(it.title).includes(norm(pageTitle));
    const localYear = firstYear(it.year);
    const yearOk = !localYear || !pageYear || localYear === pageYear;
    const status = titleOk && yearOk ? 'OK' : 'MISMATCH';
    results.push({ ...it, ogTitle, pageTitle, pageYear, ogImage, status, titleOk, yearOk });
    const flag = status === 'OK' ? '\u2713' : '\u2717';
    console.log(
      `  ${flag} [${status}] "${it.title}" (${it.year || '?'}) ` +
        `\u2192 page: "${pageTitle}" (${pageYear || '?'})`,
    );
    if (!titleOk) console.log(`      title differs!`);
    if (!yearOk) console.log(`      year differs!`);
  } catch (err) {
    console.warn(`  \u2717 [ERROR ] "${it.title}": ${err.message}`);
    results.push({ ...it, status: 'ERROR', error: err.message });
  }
  await new Promise((r) => setTimeout(r, 250));
}

// --- Write poster-preview.html ---------------------------------------------
const previewRows = results
  .map((r) => {
    const badge =
      r.status === 'OK'
        ? '<span class="ok">OK</span>'
        : r.status === 'MISMATCH'
          ? '<span class="warn">MISMATCH</span>'
          : '<span class="err">ERROR</span>';
    const img = r.ogImage
      ? `<img src="${r.ogImage}" alt="" loading="lazy" />`
      : '<div class="noimg">no image</div>';
    return `
      <tr class="${r.status.toLowerCase()}">
        <td class="img">${img}</td>
        <td>
          <div class="title">${r.title} <span class="year">(${r.year || '?'})</span></div>
          <div class="page">TMDB: <strong>${r.pageTitle || '?'}</strong> <span class="year">(${r.pageYear || '?'})</span></div>
          <div class="link"><a href="${r.link}" target="_blank" rel="noopener">${r.link}</a></div>
          ${r.error ? `<div class="errmsg">${r.error}</div>` : ''}
        </td>
        <td class="status">${badge}</td>
      </tr>`;
  })
  .join('');

const previewHtml = `<!doctype html>
<html><head><meta charset="utf-8"><title>Poster verification</title>
<style>
  body { font: 15px/1.5 -apple-system, system-ui, sans-serif; max-width: 1000px; margin: 2rem auto; padding: 0 1rem; color: #111; }
  h1 { font-size: 1.4rem; }
  table { width: 100%; border-collapse: collapse; }
  td { vertical-align: top; padding: .75rem; border-bottom: 1px solid #eee; }
  td.img { width: 120px; }
  td.img img { width: 100px; height: 150px; object-fit: cover; border-radius: 6px; box-shadow: 0 1px 4px rgba(0,0,0,.15); }
  .noimg { width: 100px; height: 150px; background: #f3f3f3; display: grid; place-items: center; color: #999; border-radius: 6px; }
  .title { font-weight: 600; }
  .year { color: #888; font-weight: 400; }
  .page { color: #555; margin-top: .25rem; }
  .link a { color: #06c; font-size: .85em; word-break: break-all; }
  .errmsg { color: #c00; font-size: .85em; margin-top: .25rem; }
  td.status { width: 110px; text-align: right; }
  .ok { background: #e6f7e6; color: #186318; padding: .15rem .5rem; border-radius: 4px; font-size: .8rem; }
  .warn { background: #fff3cd; color: #7a5b00; padding: .15rem .5rem; border-radius: 4px; font-size: .8rem; }
  .err { background: #fde2e2; color: #8a1a1a; padding: .15rem .5rem; border-radius: 4px; font-size: .8rem; }
  tr.mismatch td, tr.error td { background: #fffaf0; }
</style></head><body>
<h1>Poster verification (${results.length} items)</h1>
<p>Generated ${new Date().toISOString()}. Open each MISMATCH and confirm the TMDB link is correct, then re-run with <code>--force</code>.</p>
<table>${previewRows}</table>
</body></html>`;

await writeFile(PREVIEW, previewHtml, 'utf8');
console.log(`\nWrote ${PREVIEW}`);

// --- Update favorites.ts ----------------------------------------------------
const okItems = results.filter(
  (r) => r.status === 'OK' && r.ogImage && (FORCE || !r.poster || r.poster !== r.ogImage),
);

if (DRY) {
  console.log(`\n[dry] Would update ${okItems.length} poster(s).`);
} else if (okItems.length === 0) {
  console.log('\nNo poster updates needed.');
} else {
  // Apply edits in reverse order so offsets stay valid.
  let out = src;
  const sorted = [...okItems].sort((a, b) => b.blockStart - a.blockStart);
  let written = 0;
  for (const r of sorted) {
    const block = out.slice(r.blockStart, r.blockEnd);
    let newBlock;
    if (/poster:\s*['"][^'"]*['"],?/.test(block)) {
      newBlock = block.replace(/poster:\s*['"][^'"]*['"],?/, `poster: '${r.ogImage}',`);
    } else {
      // insert after the link line
      newBlock = block.replace(
        /(link:\s*['"][^'"]+['"],?)/,
        `$1\n        poster: '${r.ogImage}',`,
      );
    }
    if (newBlock !== block) {
      out = out.slice(0, r.blockStart) + newBlock + out.slice(r.blockEnd);
      written++;
    }
  }
  await writeFile(FILE, out, 'utf8');
  console.log(`\nUpdated ${written} poster(s) in ${FILE}.`);
}

const mismatches = results.filter((r) => r.status !== 'OK');
if (mismatches.length) {
  console.log(`\n\u26A0 ${mismatches.length} item(s) need review:`);
  for (const m of mismatches) {
    console.log(`   - ${m.title} (${m.year || '?'}) \u2192 ${m.link}`);
  }
  process.exit(1);
}
