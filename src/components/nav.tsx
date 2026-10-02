"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/Connor_Day_Resume.pdf", label: "CV", newTab: true },
  { href: "/contact", label: "Contact" },
];

const tabClass = "px-3 py-1 text-neutral-600 hover:text-black";
const activeTabClass = "bg-black px-3 py-1 text-white";

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 text-sm uppercase tracking-wide">
      {tabs.map((tab) => {
        // The CV is a static PDF, so it gets a plain <a> that opens the
        // browser's PDF viewer in a new tab instead of client-side routing.
        if (tab.newTab) {
          return (
            <a
              key={tab.href}
              href={tab.href}
              target="_blank"
              rel="noopener noreferrer"
              className={tabClass}
            >
              {tab.label}
            </a>
          );
        }

        const active =
          tab.href === "/"
            ? pathname === "/" || pathname.startsWith("/projects")
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={active ? activeTabClass : tabClass}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
