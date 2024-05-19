import SprintTable from "@/app/ui/sprints/sprint-table";
import SprintBoard from "@/app/ui/sprints/sprint-board";
import ViewSelect from "@/app/ui/sprints/view-select";
import {
  createSprint,
  deleteSprint,
  getSprints,
  updateSprint,
} from "@/lib/db/sprint";
import { createTask, getTasks } from "@/lib/db/task";
import { getProject } from "@/lib/db/project";
import { notFound } from "next/navigation";
import ButtonModal from "@/app/ui/core/button-modal";
import SprintForm from "@/app/ui/sprints/sprint-form";
import { revalidatePath } from "next/cache";
import PageBreadcrumbs from "@/app/ui/core/breadcrumbs";
import SprintHeader from "@/app/ui/sprints/sprint-header";
import { CalendarPlus, SquarePen } from "lucide-react";
import TaskForm from "@/app/ui/tasks/task-form";
import { getStatuses } from "@/lib/db/status";
import { getPriorities } from "@/lib/db/priority";
import { getUsers } from "@/lib/db/user";

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

  async function createSprintAction(form: FormData) {
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

    await createSprint({ ...sprint });
    revalidatePath(pathname);
  }

  async function updateSprintAction(form: FormData) {
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

    await updateSprint({ ...sprint });
    revalidatePath(pathname);
  }

  async function deleteSprintAction(form: FormData) {
    "use server";
    const id = form.get("id");
    if (id === null) return;
    await deleteSprint(+id);
    revalidatePath(pathname);
  }

  async function createTaskAction(form: FormData) {
    "use server";

    const sprintId = +`${form.get("sprint_id")}`;
    const title = `${form.get("title")}`;
    const description = `${form.get("description")}`;
    const category = `${form.get("category")}`;
    const priorityId = +`${form.get("priority_id")}`;
    const requirements = `${form.get("requirements")}`;
    const criteria = `${form.get("acceptance_criteria")}`;
    const points = +`${form.get("points")}`;
    const userId = +`${form.get("user_id")}`;

    const task = {
      sprint_id: sprintId,
      title: title,
      description: description,
      category: category,
      status_id: 1,
      priority_id: priorityId,
      requirements: requirements,
      acceptance_criteria: criteria,
      points: points,
      assigned_to: userId
    }

    await createTask(task);
    revalidatePath(pathname);
  }

  const selectedView = searchParams?.view ?? "table";
  const isTableView = selectedView == "table";

  const sprintComponents = [];
  const sprints = await getSprints({ project_id: project?.id });
  const statuses = await getStatuses();
  const users = await getUsers();
  const priorities = await getPriorities();

  for (const sprint of sprints) {
    const tasks = await getTasks({ sprint_id: sprint.id });

    const component = isTableView ? (
      <div key={sprint.id} className="mb-6">
        <SprintHeader
          sprint={sprint}
          updateAction={updateSprintAction}
          deleteAction={deleteSprintAction}
        />
        <SprintTable tasks={tasks} />
      </div>
    ) : (
      <div key={sprint.id} className="mb-6">
        <SprintHeader
          sprint={sprint}
          updateAction={updateSprintAction}
          deleteAction={deleteSprintAction}
        />
        <SprintBoard tasks={tasks} statuses={statuses} priorities={priorities} />
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
        <div className="flex items-row gap-2">
          <ButtonModal
            buttonChildren={
              <>
                <SquarePen size={16} /> Create Task
              </>
            }
            buttonColor="primary"
            modalTitle="Create New Task"
            modalSize="2xl"
            modalBody={<TaskForm sprints={sprints} users={users} />}
            modalScroll="outside"
            confirmText="Create Task"
            submitAction={createTaskAction}
          />
          <ButtonModal
            buttonChildren={
              <>
                <CalendarPlus size={16} /> Add Sprint
              </>
            }
            buttonColor="primary"
            modalTitle="Add New Sprint"
            modalBody={<SprintForm />}
            submitAction={createSprintAction}
          />
        </div>
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
