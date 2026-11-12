// Shared by the scripts that visit the built book in a browser: serve dist/ with `astro preview`,
// and open Chromium. Set CHROMIUM_PATH to use a Chromium that is already installed instead of
// the one `npx playwright install chromium` downloads.
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from 'playwright';
import { SITE_BASE } from './site.mjs';

/** Serves dist/ on the given port for as long as `work` runs, then stops the server. */
export async function withPreview(port, work) {
  const origin = `http://127.0.0.1:${port}`;
  const base = `${origin}${SITE_BASE}`;

  // Run Astro's own binary (not through npx) so that stopping it stops the server itself.
  // --ignore-lock keeps it a foreground server even where Astro would detect an agent and detach.
  const server = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--ignore-lock', '--host', '127.0.0.1', '--port', String(port)], {
    stdio: 'ignore',
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
  });

  try {
    let ready = false;
    for (let i = 0; i < 60 && !ready; i++) {
      try {
        ready = (await fetch(base)).ok;
      } catch {}
      if (!ready) await sleep(500);
    }
    if (!ready) throw new Error(`astro preview did not answer at ${base}`);
    return await work({ origin, base });
  } finally {
    server.kill('SIGTERM');
  }
}

export function launchBrowser() {
  const executablePath = process.env.CHROMIUM_PATH || undefined;
  return chromium.launch({ executablePath });
}
