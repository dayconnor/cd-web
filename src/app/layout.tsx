import type { Metadata } from "next";
import { Lora } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: `${siteConfig.name} — ${siteConfig.role}`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={lora.variable}>
      <body className="flex min-h-screen flex-col">
        <header className="border-b border-neutral-200">
          <div className="mx-auto flex max-w-2xl items-baseline justify-between px-6 py-6">
            <Link href="/" className="text-lg font-bold">
              {siteConfig.name}
            </Link>
            <nav className="flex gap-5 text-sm">
              <Link href="/writing" className="underline decoration-1 underline-offset-2">
                Writing
              </Link>
              <Link href="/gallery" className="underline decoration-1 underline-offset-2">
                Gallery
              </Link>
              <a
                href={`mailto:${siteConfig.email}`}
                className="underline decoration-1 underline-offset-2"
              >
                Contact
              </a>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
          {children}
        </main>

        <footer className="border-t border-neutral-200">
          <div className="mx-auto flex max-w-2xl gap-5 px-6 py-6 text-sm text-neutral-600">
            <a href={siteConfig.github} className="underline decoration-1 underline-offset-2">
              GitHub
            </a>
            <a href={siteConfig.linkedin} className="underline decoration-1 underline-offset-2">
              LinkedIn
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
