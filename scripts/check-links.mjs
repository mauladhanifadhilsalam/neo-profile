// Walk every page in dist/ and fail if an internal href or src points at nothing.
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const DIST = 'dist';
const BASE = '/neo-profile/';

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (extname(entry.name) === '.html') yield path;
  }
}

async function exists(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

async function resolves(url) {
  const clean = decodeURI(url.split('#')[0].split('?')[0]);
  if (!clean.startsWith(BASE)) return false;
  const rest = clean.slice(BASE.length);
  if (rest === '' || rest.endsWith('/')) return exists(join(DIST, rest, 'index.html'));
  return (await exists(join(DIST, rest))) || exists(join(DIST, rest, 'index.html'));
}

const broken = [];
let checked = 0;
for await (const file of htmlFiles(DIST)) {
  const html = await readFile(file, 'utf8');
  for (const [, url] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(url)) continue;
    checked++;
    if (!(await resolves(url))) broken.push(`${file}: ${url}`);
  }
}

if (broken.length) {
  console.error(`Broken internal links (${broken.length}):\n${broken.join('\n')}`);
  process.exit(1);
}
console.log(`check-links: ${checked} internal links, all resolve.`);
