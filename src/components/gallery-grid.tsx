"use client";

import { useEffect, useState } from "react";
import type { GalleryItem } from "@/content/gallery";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") {
        setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
      }
      if (e.key === "ArrowLeft") {
        setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIndex, items.length]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((item, i) => (
          <button
            key={item.src}
            onClick={() => setOpenIndex(i)}
            className="aspect-square overflow-hidden rounded bg-neutral-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              className="h-full w-full object-cover transition hover:opacity-80"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setOpenIndex(null)}
        >
          <button
            aria-label="Close"
            onClick={() => setOpenIndex(null)}
            className="absolute right-6 top-6 text-2xl text-white"
          >
            &times;
          </button>

          <button
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((openIndex - 1 + items.length) % items.length);
            }}
            className="absolute left-4 text-3xl text-white sm:left-8"
          >
            &lsaquo;
          </button>

          <figure
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full max-w-3xl flex-col items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={items[openIndex].src}
              alt={items[openIndex].alt}
              className="max-h-[80vh] max-w-full object-contain"
            />
            {items[openIndex].caption && (
              <figcaption className="mt-3 text-center text-sm text-neutral-300">
                {items[openIndex].caption}
              </figcaption>
            )}
          </figure>

          <button
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((openIndex + 1) % items.length);
            }}
            className="absolute right-4 text-3xl text-white sm:right-8"
          >
            &rsaquo;
          </button>
        </div>
      )}
    </>
  );
}
