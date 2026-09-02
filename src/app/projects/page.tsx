import Link from "next/link";
import { getAllProjects } from "@/lib/projects";

export const metadata = {
  title: "Projects",
};

export default async function ProjectsIndex() {
  const projects = await getAllProjects();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Projects</h1>
      {projects.length > 0 ? (
        <ul className="space-y-6">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="font-semibold underline decoration-1 underline-offset-2"
              >
                {project.title}
              </Link>
              <p className="text-sm text-neutral-500">{project.date}</p>
              <p className="mt-1 leading-6 text-neutral-700">{project.summary}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-neutral-600">Nothing published yet — check back soon.</p>
      )}
    </div>
  );
}
