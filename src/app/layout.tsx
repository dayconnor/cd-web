import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: `${siteConfig.name}, ${siteConfig.role}`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <header className="mx-auto w-full max-w-3xl px-6 pt-10">
          <div className="flex items-center justify-between pb-6">
            <Link href="/" className="text-2xl">
              {siteConfig.name}
            </Link>
            <Nav />
          </div>
          <hr className="border-t border-dashed border-neutral-400" />
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
          {children}
        </main>

        <footer className="mx-auto w-full max-w-3xl px-6 pb-10">
          <hr className="mb-6 border-t border-dashed border-neutral-400" />
          <div className="flex gap-5 text-base text-neutral-600">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              GitHub
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
