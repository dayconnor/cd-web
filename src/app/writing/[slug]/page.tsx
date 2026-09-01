import { getWritingSlugs, type WritingMeta } from "@/lib/writing";

export async function generateStaticParams() {
  const slugs = await getWritingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { metadata } = (await import(`@/content/writing/${slug}.mdx`)) as {
    metadata: WritingMeta;
  };
  return { title: metadata.title, description: metadata.summary };
}

export default async function WritingPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post, metadata } = (await import(
    `@/content/writing/${slug}.mdx`
  )) as { default: React.ComponentType; metadata: WritingMeta };

  return (
    <article>
      <h1 className="mb-1 text-2xl font-bold">{metadata.title}</h1>
      <p className="mb-8 text-sm text-neutral-500">{metadata.date}</p>
      <Post />
    </article>
  );
}
