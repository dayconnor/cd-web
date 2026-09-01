import fs from "node:fs";
import path from "node:path";

const WRITING_DIR = path.join(process.cwd(), "src/content/writing");

export type WritingMeta = {
  title: string;
  date: string;
  summary: string;
  draft?: boolean;
};

export type WritingEntry = WritingMeta & { slug: string };

function allSlugs(): string[] {
  return fs
    .readdirSync(WRITING_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

async function loadEntry(slug: string): Promise<WritingEntry> {
  const { metadata } = (await import(`@/content/writing/${slug}.mdx`)) as {
    metadata: WritingMeta;
  };
  return { ...metadata, slug };
}

// Only published (non-draft) slugs — safe to link to and generate pages for.
export async function getWritingSlugs(): Promise<string[]> {
  const entries = await Promise.all(allSlugs().map(loadEntry));
  return entries.filter((entry) => !entry.draft).map((entry) => entry.slug);
}

export async function getAllWriting(): Promise<WritingEntry[]> {
  const entries = await Promise.all(allSlugs().map(loadEntry));
  return entries
    .filter((entry) => !entry.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
