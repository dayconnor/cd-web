import type { MDXComponents } from "mdx/types";
import Link from "next/link";

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="mt-10 mb-4 text-2xl font-bold">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 mb-3 text-xl font-bold">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-2 text-lg font-bold">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-5 leading-7">{children}</p>
  ),
  a: ({ href = "", children }) => (
    <Link
      href={href}
      className="text-blue-800 underline decoration-1 underline-offset-2 hover:text-blue-600"
    >
      {children}
    </Link>
  ),
  ul: ({ children }) => (
    <ul className="mb-5 ml-6 list-disc space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-5 ml-6 list-decimal space-y-1">{children}</ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-5 border-l-2 border-neutral-400 pl-4 italic text-neutral-700">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="mb-5 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-neutral-400 px-3 py-2 text-left font-bold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-neutral-200 px-3 py-2">{children}</td>
  ),
  code: ({ children }) => (
    <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.9em]">
      {children}
    </code>
  ),
  hr: () => <hr className="my-10 border-neutral-300" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
