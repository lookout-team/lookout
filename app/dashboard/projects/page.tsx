import { getProjects } from "@/lib/mock/mock_db";
import ProjectCard from "@/app/ui/projects/project-card";

export default function Page() {
  const projects = getProjects();

  return (
    <div className="">
      {projects.map((project) => (
        <ProjectCard project={project} />
      ))}
    </div>
  );
}
