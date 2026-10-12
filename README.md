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
```

`npm run build` uses Playwright's Chromium for `dist/abridgement.pdf` and `dist/og.png`.
Install it once with `npx playwright install chromium`.

## Where things live

| What | Where |
| --- | --- |
| Facts: experience, education, skills, honours, certificates, contact | `src/data/profile.ts` |
| Book I, the Chronicle | `src/content/chronicle/*.mdx` |
| Book II, the Notes | `src/content/notes/*.mdx` |
| Book IV, *Gedanken* | `src/content/gedanken/*.md` |
| Type, colours, layout | `src/styles/book.css`, `src/styles/print.css` |
| Raw material (LinkedIn export, old CV) | `source/` (not published) |

`src/data/profile.ts` is the single source of truth. The pages, `/cv.json` and the
Abridgement PDF are all generated from it, so change a fact there and nowhere else.

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
update `BASE` in `scripts/check-links.mjs` and `scripts/postbuild.mjs`, and add the domain
under **Settings → Pages**.

## Elsewhere

https://www.credly.com/users/muhamad-fadhil-mauladhani/badges/credly
<br>
https://www.credly.com/users/fadhil-mauladhani/badges/credly
<br>
https://github.com/altf4m88?tab=repositories
