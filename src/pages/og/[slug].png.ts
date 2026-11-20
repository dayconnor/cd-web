import type { APIRoute, GetStaticPaths } from "astro";
import { getProjects, isoMonth } from "../../lib/projects";
import { ogPng } from "../../lib/og";
import { site } from "../../site";

export const getStaticPaths = (async () => {
  const projects = await getProjects({ includeDrafts: true });
  return [
    { params: { slug: "home" }, props: { title: site.headline, kicker: "Data Science · UC San Diego" } },
    ...projects.map((p) => ({
      params: { slug: p.id },
      props: { title: p.data.title, kicker: `Project write-up · ${isoMonth(p.data.date)}` },
    })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await ogPng(props.title as string, props.kicker as string);
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
