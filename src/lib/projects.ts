import fs from "node:fs";
import path from "node:path";

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects");

export type ProjectMeta = {
  title: string;
  date: string;
  summary: string;
  tools: string[];
  repo: string;
  draft?: boolean;
};

export type ProjectEntry = ProjectMeta & { slug: string };

function allSlugs(): string[] {
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

async function loadEntry(slug: string): Promise<ProjectEntry> {
  const { metadata } = (await import(`@/content/projects/${slug}.mdx`)) as {
    metadata: ProjectMeta;
  };
  return { ...metadata, slug };
}

// Published slugs only in production. In dev, drafts get a page too so they
// can be previewed by URL (they still stay off the homepage list).
export async function getProjectSlugs(): Promise<string[]> {
  const entries = await Promise.all(allSlugs().map(loadEntry));
  const showDrafts = process.env.NODE_ENV === "development";
  return entries
    .filter((entry) => showDrafts || !entry.draft)
    .map((entry) => entry.slug);
}

export async function getAllProjects(): Promise<ProjectEntry[]> {
  const entries = await Promise.all(allSlugs().map(loadEntry));
  return entries
    .filter((entry) => !entry.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
