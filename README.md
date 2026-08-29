# Personal portfolio site

Next.js + TypeScript + Tailwind portfolio site, deployed on Vercel. Project
write-ups live as MDX files in `src/content/writing/`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content

- **Name/bio/links**: `src/lib/site-config.ts` and `src/app/page.tsx`.
- **Add a new write-up**: drop a new `.mdx` file in `src/content/writing/`
  with an `export const metadata = { title, date, summary }` at the top —
  it'll automatically show up on `/writing` and get its own page at
  `/writing/<filename>`.

## Deploy

Push to GitHub and import the repo on [Vercel](https://vercel.com/new).
