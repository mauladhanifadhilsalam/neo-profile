// After `astro build`: print the Abridgement to dist/abridgement.pdf and render the
// social card to dist/og.png, by serving dist/ with `astro preview` and visiting it with Playwright.
import { launchBrowser, withPreview } from './lib/press.mjs';

await withPreview(4329, async ({ base }) => {
  const browser = await launchBrowser();
  try {
    const pdfPage = await browser.newPage();
    await pdfPage.goto(`${base}abridgement/`, { waitUntil: 'networkidle' });
    await pdfPage.evaluate(() => document.fonts.ready);
    await pdfPage.emulateMedia({ media: 'print' });
    await pdfPage.pdf({ path: 'dist/abridgement.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
    console.log('postbuild: wrote dist/abridgement.pdf');

    const ogPage = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await ogPage.goto(`${base}og/`, { waitUntil: 'networkidle' });
    await ogPage.evaluate(() => document.fonts.ready);
    await ogPage.screenshot({ path: 'dist/og.png' });
    console.log('postbuild: wrote dist/og.png');
  } finally {
    await browser.close();
  }
});
