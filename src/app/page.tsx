import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import { jsonLdString, personJsonLd, sharedOpenGraph } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const previewTitle = `${siteConfig.name} | Data Science Student at UC San Diego`;

// The layout's title template only applies to child routes, so the home page
// spells out the full tab title. Link previews keep the longer title.
export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} | Home` },
  alternates: { canonical: "/" },
  openGraph: { ...sharedOpenGraph, type: "website", title: previewTitle },
  twitter: { card: "summary_large_image", title: previewTitle },
};

export default async function Home() {
  const projects = await getAllProjects();

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(personJsonLd) }}
      />
      <p className="mb-5 leading-8">
        I&apos;m a third-year Data Science student studying at the University
        of California, San Diego.
      </p>
      <p className="mb-5 leading-8">
        Projects are inspired by personal interests and concepts I&apos;ve learned.
      </p>

      {projects.length > 0 && (
        <>
          <h2 className="mt-12 mb-5 text-sm uppercase tracking-wide text-neutral-500">
            Projects
          </h2>
          <ul className="space-y-6">
            {projects.map((project) => (
              <li key={project.slug}>
                <div className="flex items-baseline justify-between gap-4">
                  <Link href={`/projects/${project.slug}`} className="link text-lg">
                    {project.title}
                  </Link>
                  <span className="shrink-0 text-sm text-neutral-500">
                    {project.date.slice(0, 7)}
                  </span>
                </div>
                <p className="mt-1 leading-7 text-neutral-700">{project.summary}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
