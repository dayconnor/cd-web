import type { Metadata } from "next";
import { getProjectSlugs, type ProjectMeta } from "@/lib/projects";
import { jsonLdString, personJsonLd, sharedOpenGraph } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = (await import(`@/content/projects/${slug}.mdx`)) as {
    metadata: ProjectMeta;
  };
  const path = `/projects/${slug}`;
  return {
    title: metadata.title,
    description: metadata.summary,
    alternates: { canonical: path },
    openGraph: {
      ...sharedOpenGraph,
      type: "article",
      url: path,
      title: metadata.title,
      description: metadata.summary,
      publishedTime: metadata.date,
      authors: [siteConfig.name],
    },
  };
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

  const articleJsonLd = {
    "@type": "Article",
    headline: metadata.title,
    description: metadata.summary,
    datePublished: metadata.date,
    url: `${siteConfig.url}/projects/${slug}`,
    image: `${siteConfig.url}/projects/${slug}/opengraph-image`,
    author: personJsonLd,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(articleJsonLd) }}
      />
      <h1 className="mb-1 text-2xl font-bold">{metadata.title}</h1>
      <p className="mb-8 text-sm text-neutral-500">{metadata.date}</p>
      <Post />
    </article>
  );
}
