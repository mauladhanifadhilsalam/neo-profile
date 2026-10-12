// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Published on GitHub Pages as a project site. When a custom domain is attached,
// set `site` to it and remove `base`.
export default defineConfig({
  site: 'https://altf4m88.github.io',
  base: '/neo-profile',
  trailingSlash: 'always',
  // Keep HTML-aware whitespace handling: prose in templates relies on spaces between inline elements.
  compressHTML: true,
  build: { format: 'directory' },
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !page.includes('/og/') }),
  ],
});
