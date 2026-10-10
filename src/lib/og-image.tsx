import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const ogSize = { width: 1200, height: 630 };

// Tinos is metric-compatible with Times New Roman, the site's body font.
// Satori can't use system fonts, so the TTFs live in /assets.
const fontsPromise = Promise.all([
  readFile(join(process.cwd(), "assets/Tinos-Regular.ttf")),
  readFile(join(process.cwd(), "assets/Tinos-Bold.ttf")),
  readFile(join(process.cwd(), "src/app/icon.svg"), "base64"),
]);

export async function renderOgImage(heading: string, subheading: string) {
  const [regular, bold, icon] = await fontsPromise;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#ffffff",
          color: "#1a1a1a",
          fontFamily: "Tinos",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/svg+xml;base64,${icon}`}
            width={72}
            height={72}
            alt=""
          />
          <div style={{ fontSize: 40 }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: heading.length > 50 ? 60 : 72,
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            {heading}
          </div>
          <div style={{ fontSize: 32, color: "#525252" }}>{subheading}</div>
        </div>
        <div
          style={{
            display: "flex",
            borderTop: "2px dashed #a3a3a3",
            paddingTop: 24,
            fontSize: 28,
            color: "#525252",
          }}
        >
          {siteConfig.url.replace("https://", "")}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Tinos", data: regular, weight: 400, style: "normal" },
        { name: "Tinos", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
