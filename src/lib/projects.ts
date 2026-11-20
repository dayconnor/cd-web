import { getCollection, type CollectionEntry } from "astro:content";
import { closerFor, getPhoto } from "./photos";

export type Project = CollectionEntry<"projects">;

// Newest first. Drafts get a page in dev so they can be previewed by URL,
// but never show up in lists, feeds, or the production build.
export async function getProjects({ includeDrafts = false } = {}) {
  const showDrafts = includeDrafts && import.meta.env.DEV;
  const entries = await getCollection("projects", (e) => showDrafts || !e.data.draft);
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const isoDay = (d: Date) => d.toISOString().slice(0, 10);
export const isoMonth = (d: Date) => d.toISOString().slice(0, 7);

export function readingMinutes(body = "") {
  const words = body
    .replace(/^---[\s\S]*?---/, "")
    .replace(/<[^>]+>|!\[[^\]]*\]\([^)]*\)|[#*|`>-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

// Shared by the home list and the article h1, so the title morphs between
// the two pages during a cross-document view transition.
export const titleTransition = (slug: string) => `title-${slug}`;

// The photograph for a write-up: the one named in its frontmatter, or one
// picked from its slug when none is named. A misspelled name stops the build
// rather than leaving the page without its photo.
export function projectPhoto(p: Project) {
  const named = p.data.photo;
  if (named && !getPhoto(named)) {
    throw new Error(`Project "${p.id}" names photo "${named}", but src/assets/photos/ has no file by that name.`);
  }
  return named ?? closerFor(p.id);
}
