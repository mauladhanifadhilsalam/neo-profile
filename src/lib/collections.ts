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
