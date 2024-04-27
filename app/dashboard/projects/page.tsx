import prisma from "@/lib/db/prisma";
import { Project } from "@prisma/client";
import ProjectCard from "@/app/ui/projects/project-card";

export default async function Page() {
  const projects: Project[] = await prisma.project.findMany();

  return (
    <div className="grid grid-cols-4 gap-8">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
