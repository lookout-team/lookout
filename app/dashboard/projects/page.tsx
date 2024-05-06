import ButtonModal from "@/app/ui/core/button-modal";
import ProjectForm from "@/app/ui/projects/project-form";
import ProjectTable from "@/app/ui/projects/project-table";
import { createProject, getProjects } from "@/lib/db/project";
import { revalidatePath } from "next/cache";

export default async function Page() {
  const projects = await getProjects();

  async function createAction(form: FormData) {
    "use server";
    const project = Object.fromEntries(form.entries());
    createProject({ ...project });
    revalidatePath("/dashboard/projects");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-medium">Projects</div>
          <ButtonModal
            buttonText="Create New Project"
            modalBody={<ProjectForm />}
            submitAction={createAction}
          />
      </div>
      {projects.length > 0 && <ProjectTable projects={projects} />}
    </div>
  );
}
