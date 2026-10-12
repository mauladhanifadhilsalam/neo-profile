import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const epigraph = z.object({
  text: z.string(),
  /** Who said it, e.g. "Elder Zosima". */
  by: z.string(),
  /** The work it comes from, set in italics. */
  work: z.string().optional(),
  /** True for an adapted line, attributed "After …". */
  adapted: z.boolean().default(false),
  /** The original wording of an adapted line, given in a margin note. */
  original: z.string().optional(),
});

/** Book I: one chapter per stage of the author's working life. */
const chronicle = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/chronicle' }),
  schema: z.object({
    number: z.number().int().positive(),
    title: z.string(),
    description: z.string(),
    epigraph,
    record: z.object({
      office: z.string(),
      house: z.string(),
      place: z.string(),
      term: z.string(),
      instruments: z.array(z.string()).default([]),
    }),
    /** Years shown in the Contents, e.g. "MMXXI–MMXXIV". */
    years: z.string(),
    seeAlso: z.array(z.object({ label: z.string(), path: z.string() })).default([]),
  }),
});

/** Book II: case studies. "in-press" Notes are listed in the Contents but have no page yet. */
const notes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notes' }),
  schema: z.object({
    number: z.number().int().positive(),
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    /** Where the work was done; shown in the Contents. */
    house: z.string().optional(),
    status: z.enum(['published', 'in-press']),
    epigraph: epigraph.optional(),
    argument: z.string().optional(),
  }),
});

/** Book IV: the author's verses, aphorisms and critiques. */
const gedanken = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/gedanken' }),
  schema: z.object({
    kind: z.enum(['verse', 'aphorism', 'critique']),
    title: z.string().optional(),
    /** Ordering within its part; aphorisms are numbered § by this. */
    number: z.number().int().positive(),
    date: z.coerce.date().optional(),
    /** BCP 47 language tag when the piece is not in English, e.g. "id" or "de". */
    lang: z.string().optional(),
  }),
});

export const collections = { chronicle, notes, gedanken };
