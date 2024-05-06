import ProjectButtonModal from "@/app/ui/projects/project-button-modal";
import ProjectTable from "@/app/ui/projects/project-table";
import { createProject, getProjects } from "@/lib/db/project";

export default async function Page() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-medium">Projects</div>
        <div>
          <ProjectButtonModal />
        </div>
      </div>
      {projects.length > 0 && <ProjectTable projects={projects} />}
    </div>
  );
}
