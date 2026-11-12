# Notes from the Back End

The personal site of **Fadhil Mauladhani**, bound as a nineteenth-century book: a title page,
a Chronicle of his working life, Notes on particular pieces of work, a Tree of Knowledge,
*Gedanken* (verses, aphorisms and critiques), and back matter.

Built with [Astro](https://astro.build) as a fully static site: no server, no tracking.
Once GitHub Pages is switched on (see [Publishing](#publishing)), it is published at
<https://mauladhanifadhilsalam.github.io/neo-profile/>.

## Running it

Requires Node 22.12 or later.

```sh
npm install
npm run dev          # http://localhost:4321/neo-profile/
npm run check        # type and template check
npm run build        # builds dist/, then prints the Abridgement PDF and the social card
npm run check:links  # fails on any broken internal link in dist/
npm run check:a11y   # runs axe-core over every built page, in both themes, still and in motion
```

`npm run build` and `npm run check:a11y` drive a Chromium through Playwright. Install it once
with `npx playwright install chromium`, or point `CHROMIUM_PATH` at one you already have:

```sh
CHROMIUM_PATH=/usr/bin/chromium npm run build
```

## Where things live

| What | Where |
| --- | --- |
| Facts: experience, education, skills, honours, certificates, contact | `src/data/profile.ts` |
| Book I, the Chronicle | `src/content/chronicle/*.mdx` |
| Book II, the Notes | `src/content/notes/*.mdx` |
| Book IV, *Gedanken* | `src/content/gedanken/*.md` |
| Type, colours, layout | `src/styles/book.css`, `src/styles/print.css` |
| How the book moves | `src/styles/motion.css`, `src/scripts/*.ts` |
| Raw material (LinkedIn export, old CV) | `source/` (not published) |

`src/data/profile.ts` is the single source of truth. The pages, `/cv.json` and the
Abridgement PDF are all generated from it, so change a fact there and nowhere else.

## How it moves

The book is static and complete without a line of script. Everything that moves is laid over it:

- **The cover.** On the title page the volume lies shut under a cloth cover, and scrolling opens
  it: the front board turns over the spine, and on a wide screen comes to rest as the left-hand
  page with the bookplate pasted inside. A click on the cover opens it too.
- **Turning the leaf.** Moving between pages turns the old leaf away (cross-document view
  transitions). Going to an earlier leaf turns back instead of forward.
- **The lamp.** Lighting it spreads lamplight out from the candle; snuffing draws it back in.
  By lamplight, a pool of light follows the pointer.
- **Plates, the Tree and the thread.** Engraved plates draw themselves line by line when first
  scrolled to. The Tree of Knowledge grows, and each leaf names its instrument. The Chronicle's
  thread is ruled in red as far as the reader has followed it.
- **The owl** blinks, and watches the pointer.

No animation library is used. Three rules keep it honest, and `src/styles/motion.css` opens by
stating them:

1. Motion is an enhancement. Anything held back before it is revealed is held back only under
   `html.js`, set before first paint and withdrawn if the scripts never arrive.
2. Readers who ask their system for less motion (`prefers-reduced-motion`) get the book lying
   still. So do browsers that lack what the binding needs; they keep the plain title leaf.
3. Scripts report, styles perform. A script publishes a number (`--p`, `--read`) or a class
   (`.is-in`, `.is-open`) from a single shared animation frame; the stylesheet decides what
   that looks like.

To have something revealed as it is scrolled to, mark it `data-reveal` (or
`data-reveal="cascade"` to let its children arrive one after another).

### Adding to *Gedanken*

Each piece is one Markdown file in `src/content/gedanken/`:

```md
---
kind: verse          # verse | aphorism | critique
number: 1            # order within its part; aphorisms are numbered § by it
title: On Lamplight  # optional for aphorisms
lang: id             # optional, when the piece is not in English
---
First line of the poem
second line

A blank line starts a new stanza.
```

Verse is set line by line, with a line number in the margin every fifth line. Aphorisms and
critiques are ordinary Markdown.

### Publishing a Note that is in press

Notes II, IV and V are listed in the Contents as "in press". To publish one, write its body in
`src/content/notes/` and change `status: in-press` to `status: published`.

### Proof notes

`<ProofNote>` marks material still to be supplied (figures, the author's own reflections).
These show only under `npm run dev`; the published site never displays them.

## Publishing

Every push to `master` builds the site and deploys it to GitHub Pages
(`.github/workflows/deploy.yml`). Other branches and pull requests are checked by
`.github/workflows/ci.yml`.

One-time setup: in the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.

To use a custom domain later, set `site` to the domain in `astro.config.mjs`, remove `base`,
set `SITE_BASE` to `/` in `scripts/lib/site.mjs`, and add the domain
under **Settings → Pages**.

## Elsewhere

https://www.credly.com/users/muhamad-fadhil-mauladhani/badges/credly
<br>
https://www.credly.com/users/fadhil-mauladhani/badges/credly
<br>
https://github.com/altf4m88?tab=repositories
