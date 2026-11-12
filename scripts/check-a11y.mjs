// Run axe-core over every page of the built book, by daylight and by lamplight, and fail on
// any violation. Each page is checked twice over:
//   - lying still (reduced motion), which is the book as a reader with motion turned off has it;
//   - in motion, scrolled from top to bottom first so that everything held back has arrived.
import { readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { AxeBuilder } from '@axe-core/playwright';
import { launchBrowser, withPreview } from './lib/press.mjs';

const DIST = 'dist';
// The social card is a picture, not a page; it is screenshotted and never read.
const SKIP = new Set(['og/']);

async function* pages(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* pages(path);
    else if (entry.name === 'index.html') yield relative(DIST, dir).split(sep).join('/').replace(/^$/, '').replace(/([^/])$/, '$1/');
  }
}

const paths = [];
for await (const path of pages(DIST)) if (!SKIP.has(path)) paths.push(path);
paths.sort();

const failures = [];
let checks = 0;

await withPreview(4331, async ({ base }) => {
  const browser = await launchBrowser();
  try {
    for (const colorScheme of ['light', 'dark']) {
      for (const reducedMotion of ['reduce', 'no-preference']) {
        const context = await browser.newContext({ colorScheme, reducedMotion, viewport: { width: 1280, height: 900 } });
        const page = await context.newPage();
        for (const path of paths) {
          await page.goto(base + path, { waitUntil: 'networkidle' });
          await page.evaluate(() => document.fonts.ready);
          if (reducedMotion === 'no-preference') {
            // Walk the page so that every reveal fires, then let the last of them finish.
            await page.evaluate(async () => {
              const step = Math.round(window.innerHeight * 0.6);
              for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
                window.scrollTo({ top: y, behavior: 'instant' });
                await new Promise((resolve) => setTimeout(resolve, 120));
              }
            });
            await page.waitForTimeout(2800);
          }
          const { violations } = await new AxeBuilder({ page }).analyze();
          checks++;
          for (const v of violations) {
            failures.push(`/${path} [${colorScheme}, motion: ${reducedMotion}] ${v.id} (${v.impact}): ${v.help}\n    ${v.nodes.map((n) => n.target.join(' ')).slice(0, 5).join('\n    ')}`);
          }
        }
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
});

if (failures.length) {
  console.error(`check-a11y: ${failures.length} violation(s):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`check-a11y: ${paths.length} pages, ${checks} checks (daylight and lamplight, still and in motion), no violations.`);
