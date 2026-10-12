// After `astro build`: print the Abridgement to dist/abridgement.pdf and render the
// social card to dist/og.png, by serving dist/ with `astro preview` and visiting it with Playwright.
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from 'playwright';

const PORT = 4329;
const BASE = `http://127.0.0.1:${PORT}/neo-profile/`;

// Run Astro's own binary (not through npx) so that stopping it stops the server itself.
// --ignore-lock keeps it a foreground server even where Astro would detect an agent and detach.
const server = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--ignore-lock', '--host', '127.0.0.1', '--port', String(PORT)], {
  stdio: 'ignore',
  env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
});

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return;
    } catch {}
    await sleep(500);
  }
  throw new Error(`astro preview did not answer at ${BASE}`);
}

let browser;
try {
  await waitForServer();
  browser = await chromium.launch();

  const pdfPage = await browser.newPage();
  await pdfPage.goto(`${BASE}abridgement/`, { waitUntil: 'networkidle' });
  await pdfPage.evaluate(() => document.fonts.ready);
  await pdfPage.emulateMedia({ media: 'print' });
  await pdfPage.pdf({ path: 'dist/abridgement.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
  console.log('postbuild: wrote dist/abridgement.pdf');

  const ogPage = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await ogPage.goto(`${BASE}og/`, { waitUntil: 'networkidle' });
  await ogPage.evaluate(() => document.fonts.ready);
  await ogPage.screenshot({ path: 'dist/og.png' });
  console.log('postbuild: wrote dist/og.png');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
