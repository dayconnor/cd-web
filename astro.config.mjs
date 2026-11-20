// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";

/**
 * @param {string} file
 * @param {number} weight
 * @param {"normal" | "italic"} [style]
 * @returns {{ src: [string]; weight: number; style: "normal" | "italic" }}
 */
const font = (file, weight, style = "normal") => ({
  src: [`./src/assets/fonts/${file}.woff2`],
  weight,
  style,
});

export default defineConfig({
  site: "https://www.connor.day",
  // Matches the current site's URLs (/projects/slug, no trailing slash).
  trailingSlash: "never",
  build: { format: "file", inlineStylesheets: "always" },
  integrations: [mdx()],
  devToolbar: { enabled: false },

  // The write-up images are charts: thin lines and small text. Near-lossless
  // WebP keeps them sharp while still beating the source PNGs on size.
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: { webp: { nearLossless: true, quality: 60, effort: 6 } },
    },
  },

  // Fonts are subset to Latin plus the few symbols the write-ups use.
  // Astro emits the @font-face rules, preload links, and fallback faces
  // with adjusted metrics so the swap from system font causes no layout shift.
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Inter",
      cssVariable: "--font-inter",
      fallbacks: ["system-ui", "sans-serif"],
      options: {
        variants: [
          font("inter-400", 400),
          font("inter-400-italic", 400, "italic"),
          font("inter-600", 600),
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Newsreader",
      cssVariable: "--font-newsreader",
      fallbacks: ["Georgia", "serif"],
      options: {
        variants: [
          font("newsreader-400", 400),
          font("newsreader-400-italic", 400, "italic"),
        ],
      },
    },
    {
      // Newsreader's optical size axis pinned at 72: higher contrast and
      // tighter spacing, made for the very large name on the homepage.
      provider: fontProviders.local(),
      name: "Newsreader Display",
      cssVariable: "--font-display",
      fallbacks: ["Georgia", "serif"],
      options: { variants: [font("newsreader-display", 400)] },
    },
    {
      provider: fontProviders.local(),
      name: "JetBrains Mono",
      cssVariable: "--font-mono",
      fallbacks: ["ui-monospace", "monospace"],
      options: { variants: [font("jetbrains-mono-400", 400)] },
    },
  ],
});
