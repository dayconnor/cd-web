import { galleryItems } from "@/content/gallery";
import { GalleryGrid } from "@/components/gallery-grid";

export const metadata = {
  title: "Gallery",
};

export default function GalleryPage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Gallery</h1>
      {galleryItems.length > 0 ? (
        <GalleryGrid items={galleryItems} />
      ) : (
        <p className="text-neutral-600">Nothing here yet — check back soon.</p>
      )}
    </div>
  );
}
