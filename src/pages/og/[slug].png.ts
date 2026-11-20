import type { APIRoute, GetStaticPaths } from "astro";
import { getProjects } from "../../lib/projects";
import { ogHomePng, ogPng } from "../../lib/og";

export const getStaticPaths = (async () => {
  const projects = await getProjects({ includeDrafts: true });
  return [
    { params: { slug: "home" }, props: { home: true, title: "data science · uc san diego" } },
    ...projects.map((p) => ({ params: { slug: p.id }, props: { home: false, title: p.data.title } })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const title = props.title as string;
  const png = props.home ? await ogHomePng(title) : await ogPng(title);
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
