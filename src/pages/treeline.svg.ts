import type { APIRoute } from "astro";
import { trees } from "../lib/scene";

// The treeline along the bottom of every page: generated once at build time
// into a single cached SVG, then tiled horizontally by CSS.
const W = 1200;
const H = 132;

export const GET: APIRoute = () => {
  const far = trees({ seed: 7, from: 0, to: W, base: H, minH: 34, maxH: 62, gap: [11, 16], wrap: W });
  const near = trees({ seed: 23, from: 0, to: W, base: H, minH: 46, maxH: 92, gap: [18, 30], wrap: W });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c0f14" stop-opacity="0"/><stop offset=".55" stop-color="#151a22"/><stop offset="1" stop-color="#1d242e"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#haze)"/>
<path fill="#10141a" d="${far}"/>
<path fill="#07090c" d="${near}"/>
</svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
};
