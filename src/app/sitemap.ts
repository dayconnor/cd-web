import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();
  const latest = projects[0]?.date;

  return [
    { url: siteConfig.url, lastModified: latest },
    { url: `${siteConfig.url}/contact` },
    ...projects.map((project) => ({
      url: `${siteConfig.url}/projects/${project.slug}`,
      lastModified: project.date,
    })),
  ];
}
