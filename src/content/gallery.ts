export type GalleryItem = {
  src: string;
  alt: string;
  caption?: string;
};

// Add image files to public/gallery/, then list them here in the order
// you want them to appear.
export const galleryItems: GalleryItem[] = [
  // { src: "/gallery/example.jpg", alt: "Short description", caption: "Title, Artist, Year" },
];
