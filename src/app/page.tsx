import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { getAllWriting } from "@/lib/writing";

export default async function Home() {
  const writing = await getAllWriting();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">{siteConfig.name}</h1>
      <p className="mb-8 text-neutral-600">{siteConfig.role}</p>

      {/* TODO: replace with your real bio — a few sentences on your background,
          what you work on, and what you're looking for. */}
      <p className="mb-5 leading-7">
        I&apos;m a rising fourth-year Data Science student. This is a placeholder
        bio — swap it out in{" "}
        <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.9em]">
          src/app/page.tsx
        </code>{" "}
        for a couple of sentences on your background, the kind of problems you
        like working on, and what you&apos;re looking for.
      </p>

      {writing.length > 0 && (
        <>
          <h2 className="mt-10 mb-4 text-lg font-bold">Writing</h2>
          <ul className="space-y-4">
            {writing.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/writing/${post.slug}`}
                  className="font-semibold underline decoration-1 underline-offset-2"
                >
                  {post.title}
                </Link>
                <p className="text-sm text-neutral-600">{post.summary}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
