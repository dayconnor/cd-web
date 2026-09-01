import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">{siteConfig.name}</h1>
      <p className="text-neutral-700">{siteConfig.email}</p>
    </div>
  );
}
