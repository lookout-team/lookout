import SprintTable from "@/app/ui/sprints/sprint-table";
import SprintBoard from "@/app/ui/sprints/sprint-board";
import ViewSelect from "@/app/ui/sprints/view-select";
import {
  createSprint,
  deleteSprint,
  getSprints,
  updateSprint,
} from "@/lib/db/sprint";
import { getTasks } from "@/lib/db/task";
import { getProject } from "@/lib/db/project";
import { notFound } from "next/navigation";
import ButtonModal from "@/app/ui/core/button-modal";
import SprintForm from "@/app/ui/sprints/sprint-form";
import { revalidatePath } from "next/cache";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import PageBreadcrumbs from "@/app/ui/core/breadcrumbs";

type QueryParams = {
  view: "board" | "table";
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: number };
  searchParams?: QueryParams;
}) {
  const pathname = `/dashboard/projects/${params.id}`;

  const selectedView = searchParams?.view ?? "table";
  const isTableView = selectedView == "table";

  const project = await getProject(+params.id);
  if (!project) return notFound();

  const sprintComponents = [];
  const sprints = await getSprints({ project_id: project?.id });

  for (const sprint of sprints) {
    const tasks = await getTasks({ sprint_id: sprint.id });

    const component = isTableView ? (
      <div className="mb-6">
        <SprintTable key={sprint.id} sprint={sprint} tasks={tasks} />
      </div>
    ) : (
      <div className="mb-6">
        <SprintBoard key={sprint.id} sprint={sprint} tasks={tasks} />
      </div>
    );

    sprintComponents.push(component);
  }

  async function createAction(form: FormData) {
    "use server";
    const sprint = Object.fromEntries(form.entries());
    createSprint({ ...sprint });
    revalidatePath(pathname);
  }

  async function editAction(form: FormData) {
    "use server";
    const sprint = Object.fromEntries(form.entries());
    updateSprint({ ...sprint });
    revalidatePath(pathname);
  }

  async function deleteAction(form: FormData) {
    "use server";
    const id = form.get("id");
    if (id !== null) deleteSprint(+id);
    revalidatePath(pathname);
  }

  const breadcrumbs = [
    { title: "Projects", link: "/dashboard/projects" },
    { title: project.title ?? "", link: undefined },
  ];

  return (
    <>
      <PageBreadcrumbs items={breadcrumbs} />
      <div className="flex justify-between items-center mt-4 mb-6">
        <div className="text-2xl font-medium">{project.title}</div>
        <ButtonModal
          buttonChildren="Create New Sprint"
          buttonColor="primary"
          modalTitle="Create New Sprint"
          modalBody={<SprintForm />}
          submitAction={createAction}
        />
      </div>
      <div className="grid grid-cols-10 gap-4">
        <div className="col-span-2">
          <ViewSelect selectedView={selectedView} />
        </div>
        <div className="mt-4 col-span-8">{sprintComponents}</div>
      </div>
    </>
  );
}
