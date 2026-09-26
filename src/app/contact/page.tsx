import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div>
      <h2 className="mb-3 text-sm uppercase tracking-wide text-neutral-500">
        Email
      </h2>
      <p className="text-lg">{siteConfig.email}</p>
    </div>
  );
}
