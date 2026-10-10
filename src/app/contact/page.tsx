import { CopyEmail } from "@/components/copy-email";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Contact",
  description: `Email and location for ${siteConfig.name}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-2 text-sm uppercase tracking-wide text-neutral-500">
          Email
        </h2>
        <p className="text-lg">
          <CopyEmail email={siteConfig.email} />
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-sm uppercase tracking-wide text-neutral-500">
          Location
        </h2>
        <p className="text-lg">{siteConfig.location}</p>
      </section>

      <section>
        <h2 className="mb-2 text-sm uppercase tracking-wide text-neutral-500">
          Elsewhere
        </h2>
        <div className="flex gap-5 text-lg">
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
      </section>
    </div>
  );
}

