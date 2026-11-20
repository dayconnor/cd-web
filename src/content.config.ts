import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    // Short lowercase name for the homepage list.
    label: z.string(),
    // Name of the photograph behind this write-up and its homepage hover
    // (a file in src/assets/photos/, without the extension).
    photo: z.string().optional(),
    date: z.coerce.date(),
    summary: z.string(),
    tools: z.array(z.string()),
    repo: z.string(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { projects };
