import { getCollection, type CollectionEntry } from 'astro:content';

export type Chapter = CollectionEntry<'chronicle'>;
export type Note = CollectionEntry<'notes'>;

/** Book I, in order. */
export async function getChronicle(): Promise<Chapter[]> {
  return (await getCollection('chronicle')).sort((a, b) => a.data.number - b.data.number);
}

/** Book II, in order, including Notes still in press. */
export async function getNotes(): Promise<Note[]> {
  return (await getCollection('notes')).sort((a, b) => a.data.number - b.data.number);
}

export const chapterPath = (entry: Chapter) => `/chronicle/${entry.id}/`;

/** Note files are numbered for ordering ("03-of-legacy"); their pages are not. */
export const noteSlug = (entry: Note) => entry.id.replace(/^\d+-/, '');
export const notePath = (entry: Note) => `/notes/${noteSlug(entry)}/`;
export const isPublished = (entry: Note) => entry.data.status === 'published';

/**
 * Every leaf of the book in reading order, as site paths without the base. The layout hands
 * this to the browser so that moving between leaves can turn forward or back as a reader would.
 */
export async function getLeafOrder(): Promise<string[]> {
  const chapters = await getChronicle();
  const published = (await getNotes()).filter(isPublished);
  return [
    '/',
    '/preface/',
    '/chronicle/',
    ...chapters.map(chapterPath),
    '/notes/',
    ...published.map(notePath),
    '/knowledge/',
    '/gedanken/',
    '/honours/',
    '/correspondence/',
    '/colophon/',
    '/abridgement/',
  ];
}
