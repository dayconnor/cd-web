import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getProjects } from "../lib/projects";
import { site } from "../site";

export async function GET(context: APIContext) {
  const projects = await getProjects();
  return rss({
    title: site.name,
    description: site.description,
    site: context.site ?? site.url,
    items: projects.map((p) => ({
      title: p.data.title,
      description: p.data.summary,
      pubDate: p.data.date,
      link: `/projects/${p.id}`,
    })),
  });
}
