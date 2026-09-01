import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { getAllWriting } from "@/lib/writing";

export default async function Home() {
  const writing = await getAllWriting();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">{siteConfig.name}</h1>
      <p className="mb-8 text-neutral-600">{siteConfig.role}</p>

      <p className="mb-5 leading-7">
        I&apos;m a fourth-year Data Science student studying at the University
        of California, San Diego.
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
