"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 text-sm uppercase tracking-wide">
      {tabs.map((tab) => {
        const active =
          tab.href === "/"
            ? pathname === "/" || pathname.startsWith("/projects")
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              active
                ? "bg-black px-3 py-1 text-white"
                : "px-3 py-1 text-neutral-600 hover:text-black"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
