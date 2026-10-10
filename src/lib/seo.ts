import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const sharedOpenGraph = {
  siteName: siteConfig.name,
  locale: "en_US",
} satisfies Metadata["openGraph"];

export const personJsonLd = {
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: siteConfig.role,
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "University of California, San Diego",
  },
  sameAs: [siteConfig.github, siteConfig.linkedin],
};

// Escapes "<" so a string in the data can't close the <script> tag early.
export function jsonLdString(data: object): string {
  return JSON.stringify({ "@context": "https://schema.org", ...data }).replace(
    /</g,
    "\\u003c",
  );
}
