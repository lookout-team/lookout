import ButtonModal from "@/app/ui/core/button-modal";
import ProjectForm from "@/app/ui/projects/project-form";
import ProjectTable from "@/app/ui/projects/project-table";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "@/lib/db/project";
import { SquareGanttChart, SquarePen } from "lucide-react";
import { Metadata } from "next";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = {
  title: "Projects - Lookout",
  description: "AI-Powered Project Management Platform",
};

export default async function Page() {
  const projects = await getProjects();

  async function createAction(form: FormData) {
    "use server";
    const title = form.get("title")?.toString();
    const description = form.get("description")?.toString();
    if (!title || !description) return;

    await createProject({
      title: title,
      description: description,
      last_updated: null,
      current_sprint_id: null,
    });
    
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
          confirmColor="primary"
          submitAction={createAction}
        />
      </div>
      {projects.length > 0 ? (
        <ProjectTable
          projects={projects}
          editAction={editAction}
          deleteAction={deleteAction}
        />
      ) : (
        <div className="flex items-center place-content-center h-20 opacity-75">
          <SquareGanttChart size={36} className="me-4" />
          <h1 className="text-xl">
            No projects yet! Create one to get started.
          </h1>
        </div>
      )}
    </div>
  );
}
