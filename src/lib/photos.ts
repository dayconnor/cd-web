// Optional photographs. Drop files into src/assets/photos/ (any of jpg, jpeg,
// png, webp, avif) and describe them in src/assets/photos/credits.json:
//
//   { "road": { "alt": "…", "credit": "Name or @handle", "url": "https://…", "focus": "center 20%" } }
//
// The key is the file name without its extension. A photo with no file simply
// doesn't render, so pages look complete before any photos are added.
import type { ImageMetadata } from "astro";

const files = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/photos/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}",
  { eager: true },
);
const creditFiles = import.meta.glob<{ default: Record<string, PhotoInfo> }>(
  "../assets/photos/credits.json",
  { eager: true },
);

// focus is a CSS object-position, for photos whose subject sits off center.
export interface PhotoInfo { alt: string; credit?: string; url?: string; focus?: string }

const credits: Record<string, PhotoInfo> = Object.values(creditFiles)[0]?.default ?? {};

export function getPhoto(name: string) {
  const hit = Object.entries(files).find(([path]) => path.split("/").pop()!.replace(/\.\w+$/, "") === name);
  if (!hit) return undefined;
  return { image: hit[1].default, info: credits[name] };
}

// The fallback for write-ups that don't name a photo in their frontmatter:
// one picked by slug, so a project always shows the same one.
const closers = ["footpath", "drift", "alley", "bend", "hillside", "crossing"];
export function closerFor(slug: string) {
  const pool = closers.filter((n) => getPhoto(n));
  if (!pool.length) return undefined;
  let h = 2166136261;
  for (const c of slug) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return pool[(h >>> 0) % pool.length];
}

// Everyone credited, once each, for the footer.
export function photographers() {
  const seen = new Map<string, PhotoInfo>();
  for (const [name, info] of Object.entries(credits)) {
    if (info.credit && getPhoto(name) && !seen.has(info.credit)) seen.set(info.credit, info);
  }
  return [...seen.values()];
}
