import ButtonModal from "@/app/ui/core/button-modal";
import ProjectForm from "@/app/ui/projects/project-form";
import ProjectTable from "@/app/ui/projects/project-table";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "@/lib/db/project";
import { SquarePen } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function Page() {
  const projects = await getProjects();

  async function createAction(form: FormData) {
    "use server";
    const project = Object.fromEntries(form.entries());
    await createProject({ ...project });
    revalidatePath("/dashboard/projects");
  }

  async function editAction(form: FormData) {
    "use server";
    const project = Object.fromEntries(form.entries());
    await updateProject({ ...project });
    revalidatePath("/dashboard/projects");
  }

  async function deleteAction(form: FormData) {
    "use server";
    const id = form.get("id");
    if (id !== null) await deleteProject(+id);
    revalidatePath("/dashboard/projects");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-medium">Projects</div>
        <ButtonModal
          buttonChildren={
            <>
              <SquarePen size={16} /> Create New Project
            </>
          }
          buttonColor="primary"
          modalTitle="Create New Project"
          modalBody={<ProjectForm />}
          confirmText="Create Project"
          submitAction={createAction}
        />
      </div>
      {projects.length > 0 && (
        <ProjectTable
          projects={projects}
          editAction={editAction}
          deleteAction={deleteAction}
        />
      )}
    </div>
  );
}
