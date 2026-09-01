import Link from "next/link";
import { getAllWriting } from "@/lib/writing";

export const metadata = {
  title: "Writing",
};

export default async function WritingIndex() {
  const writing = await getAllWriting();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Writing</h1>
      {writing.length > 0 ? (
        <ul className="space-y-6">
          {writing.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/writing/${post.slug}`}
                className="font-semibold underline decoration-1 underline-offset-2"
              >
                {post.title}
              </Link>
              <p className="text-sm text-neutral-500">{post.date}</p>
              <p className="mt-1 leading-6 text-neutral-700">{post.summary}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-neutral-600">Nothing published yet — check back soon.</p>
      )}
    </div>
  );
}
