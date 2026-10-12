import type { APIRoute } from 'astro';
import { profile } from '../data/profile';
import { href } from '../lib/book';

/** The machine-readable edition of the book: the same facts as the pages, as JSON. */
export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => new URL(href(path), site).toString();
  const edition = {
    name: profile.name,
    fullName: profile.fullName,
    title: profile.plainTitle,
    tagline: profile.tagline,
    location: profile.location,
    email: profile.email,
    links: { ...profile.links, book: url('/'), abridgement: url('/abridgement/'), pdf: url('/abridgement.pdf') },
    motto: profile.motto,
    summary: profile.summary,
    experience: profile.experience.map(({ chapter, ...rest }) => ({ ...rest, chapter: url(chapter) })),
    education: profile.education,
    skills: Object.fromEntries(profile.knowledge.map((b) => [b.key, b.instruments.map((i) => i.name)])),
    honours: profile.honours,
    certificates: profile.certificates,
    languages: profile.languages,
  };
  return new Response(JSON.stringify(edition, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
