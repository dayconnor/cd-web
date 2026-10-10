import { ogSize, renderOgImage } from "@/lib/og-image";
import { getProjectSlugs, type ProjectMeta } from "@/lib/projects";

export const alt = "Project write-up";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { metadata } = (await import(`@/content/projects/${slug}.mdx`)) as {
    metadata: ProjectMeta;
  };
  return renderOgImage(metadata.title, `Project write-up, ${metadata.date.slice(0, 7)}`);
}
