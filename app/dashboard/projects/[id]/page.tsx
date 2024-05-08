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
import PageBreadcrumbs from "@/app/ui/core/breadcrumbs";
import SprintHeader from "@/app/ui/sprints/sprint-header";

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
  
  const project = await getProject(+params.id);
  if (!project) return notFound();

  async function createAction(form: FormData) {
    "use server";
    if (!project) return;

    const title = `${form.get("title")}`;
    const start_date = new Date(`${form.get("start_date")}`);
    const end_date = new Date(`${form.get("end_date")}`);
    const planned_capacity = +`${form.get("planned_capacity")}`;

    const sprint = {
      title: title,
      start_date: start_date,
      end_date: end_date,
      planned_capacity: planned_capacity,
      project_id: project.id,
    };

    createSprint({ ...sprint });
    revalidatePath(pathname);
  }

  async function editAction(form: FormData) {
    "use server";
    if (!project) return;

    const id = `${form.get("id")}`;
    const title = `${form.get("title")}`;
    const start_date = new Date(`${form.get("start_date")}`);
    const end_date = new Date(`${form.get("end_date")}`);
    const planned_capacity = +`${form.get("planned_capacity")}`;

    const sprint = {
      id: +id,
      title: title,
      start_date: start_date,
      end_date: end_date,
      planned_capacity: planned_capacity,
      project_id: project.id,
    };

    updateSprint({ ...sprint });
    revalidatePath(pathname);
  }

  async function deleteAction(form: FormData) {
    "use server";
    const id = form.get("id");
    if (id !== null) deleteSprint(+id);
    revalidatePath(pathname);
  }

  const selectedView = searchParams?.view ?? "table";
  const isTableView = selectedView == "table";

  const sprintComponents = [];
  const sprints = await getSprints({ project_id: project?.id });

  for (const sprint of sprints) {
    const tasks = await getTasks({ sprint_id: sprint.id });

    const component = isTableView ? (
      <div key={sprint.id} className="mb-6">
        <SprintHeader
          sprint={sprint}
          editAction={editAction}
          deleteAction={deleteAction}
        />
        <SprintTable tasks={tasks} />
      </div>
    ) : (
      <div key={sprint.id} className="mb-6">
        <SprintHeader
          sprint={sprint}
          editAction={editAction}
          deleteAction={deleteAction}
        />
        <SprintBoard tasks={tasks} />
      </div>
    );

    sprintComponents.push(component);
  }

  const breadcrumbs = [
    { title: "Projects", link: "/dashboard/projects" },
    { title: project.title ?? "", link: undefined },
  ];

  return (
    <>
      <PageBreadcrumbs items={breadcrumbs} />
      <div className="flex justify-between items-center mt-4 mb-2">
        <div className="text-2xl font-medium">{project.title}</div>
        <ButtonModal
          buttonChildren="Create New Sprint"
          buttonColor="primary"
          modalTitle="Create New Sprint"
          modalBody={<SprintForm />}
          submitAction={createAction}
        />
      </div>
      <div className="grid grid-cols-10 gap-6">
        <div className="col-span-2">
          <ViewSelect selectedView={selectedView} />
        </div>
        <div className="mt-4 col-span-8">{sprintComponents}</div>
      </div>
    </>
  );
}
