import { getProjectSlugs, type ProjectMeta } from "@/lib/projects";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { metadata } = (await import(`@/content/projects/${slug}.mdx`)) as {
    metadata: ProjectMeta;
  };
  return { title: metadata.title, description: metadata.summary };
}

export default async function ProjectPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post, metadata } = (await import(
    `@/content/projects/${slug}.mdx`
  )) as { default: React.ComponentType; metadata: ProjectMeta };

  return (
    <article>
      <h1 className="mb-1 text-2xl font-bold">{metadata.title}</h1>
      <p className="mb-8 text-sm text-neutral-500">{metadata.date}</p>
      <Post />
    </article>
  );
}
