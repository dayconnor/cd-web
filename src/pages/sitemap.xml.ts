import { getProjects, isoDay } from "../lib/projects";
import { site } from "../site";

export async function GET() {
  const projects = await getProjects();
  const urls = [
    { loc: site.url, lastmod: projects[0] && isoDay(projects[0].data.date) },
    { loc: `${site.url}/contact` },
    ...projects.map((p) => ({ loc: `${site.url}/projects/${p.id}`, lastmod: isoDay(p.data.date) })),
  ];
  const body = urls
    .map((u) => `<url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`)
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
