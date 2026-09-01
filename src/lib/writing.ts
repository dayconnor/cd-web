import fs from "node:fs";
import path from "node:path";

const WRITING_DIR = path.join(process.cwd(), "src/content/writing");

export type WritingMeta = {
  title: string;
  date: string;
  summary: string;
};

export type WritingEntry = WritingMeta & { slug: string };

export function getWritingSlugs(): string[] {
  return fs
    .readdirSync(WRITING_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export async function getAllWriting(): Promise<WritingEntry[]> {
  const slugs = getWritingSlugs();
  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = (await import(`@/content/writing/${slug}.mdx`)) as {
        metadata: WritingMeta;
      };
      return { ...metadata, slug };
    })
  );
  return entries.sort((a, b) => (a.date < b.date ? 1 : -1));
}
