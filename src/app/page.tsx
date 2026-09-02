import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { getAllProjects } from "@/lib/projects";

export default async function Home() {
  const projects = await getAllProjects();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">{siteConfig.name}</h1>
      <p className="mb-8 text-neutral-600">{siteConfig.role}</p>

      <p className="mb-5 leading-7">
        I&apos;m a fourth-year Data Science student studying at the University
        of California, San Diego.
      </p>

      {projects.length > 0 && (
        <>
          <h2 className="mt-10 mb-4 text-lg font-bold">Projects</h2>
          <ul className="space-y-4">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="font-semibold underline decoration-1 underline-offset-2"
                >
                  {project.title}
                </Link>
                <p className="text-sm text-neutral-600">{project.summary}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
