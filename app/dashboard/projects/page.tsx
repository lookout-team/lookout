import { Project } from "@prisma/client";
import ProjectCard from "@/app/ui/projects/project-card";

export default function Page() {
  const projects: Project[] = [];

  for (let i = 1; i < 10; i++) {
    projects.push({
      id: i,
      title: `Project ${i}`,
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    });
  }

  return (
    <div className="grid grid-cols-4 gap-8">
      {projects.map((project) => (
        <ProjectCard project={project} />
      ))}
    </div>
  );
}
