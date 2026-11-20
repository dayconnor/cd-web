import { readFile } from "node:fs/promises";
import satori from "satori";
import sharp from "sharp";
import { site } from "../site";

// Satori needs TTF/OTF/WOFF, not WOFF2, so the OG fonts live separately.
const fonts = Promise.all([
  readFile("src/assets/og-fonts/newsreader-display.ttf"),
  readFile("src/assets/og-fonts/jetbrains-mono.ttf"),
]);

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string)[]): Node => ({
  type,
  props: { style: { display: "flex", ...style }, children: children.length === 1 ? children[0] : children },
});

const scene = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">
  <path d="M0 74 Q520 170 1010 58" stroke="#1e232d" stroke-width="2"/>
  <path d="M0 104 Q520 204 1010 74" stroke="#1e232d" stroke-width="2"/>
  <path d="M1010 58 Q1110 100 1200 84" stroke="#1e232d" stroke-width="2"/>
  <path d="M1010 74 Q1110 118 1200 104" stroke="#1e232d" stroke-width="2"/>
  <rect x="1008" y="26" width="5" height="604" fill="#161a21"/>
  <path d="M1010 36 C986 22 956 22 934 38" stroke="#1f242d" stroke-width="4"/>
  <rect x="918" y="42" width="30" height="7" rx="3.5" fill="#efe9d5"/>
</svg>`,
)}`;

export async function ogPng(title: string, kicker: string) {
  const [serif, mono] = await fonts;
  const big = title.length > 60 ? 54 : 64;

  const tree = h(
    "div",
    {
      width: "100%",
      height: "100%",
      position: "relative",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "76px 84px 70px",
      backgroundColor: "#080a0d",
      backgroundImage:
        "radial-gradient(circle at 78% 6%, rgba(239,233,213,0.16), rgba(150,165,190,0.04) 34%, rgba(8,10,13,0) 60%)",
      color: "#d5dce4",
      fontFamily: "Newsreader",
    },
    { type: "img", props: { src: scene, width: 1200, height: 630, style: { position: "absolute", top: 0, left: 0 } } },
    h(
      "div",
      { alignItems: "center", gap: 18, fontSize: 34, letterSpacing: "-0.01em" },
      h("div", { width: 11, height: 11, borderRadius: 11, backgroundColor: "#efe9d5", boxShadow: "0 0 18px 4px rgba(239,233,213,0.35)" }),
      site.name,
    ),
    h(
      "div",
      { flexDirection: "column", gap: 26, maxWidth: 900 },
      h("div", { fontSize: big, lineHeight: 1.12, letterSpacing: "-0.02em" }, title),
      h("div", { fontFamily: "JetBrains Mono", fontSize: 24, color: "#768191" }, kicker),
    ),
    h(
      "div",
      { fontFamily: "JetBrains Mono", fontSize: 22, color: "#768191", borderTop: "2px solid #1e232d", paddingTop: 24, width: "100%" },
      "connor.day",
    ),
  );

  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Newsreader", data: serif, weight: 400, style: "normal" },
      { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
    ],
  });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();
}
