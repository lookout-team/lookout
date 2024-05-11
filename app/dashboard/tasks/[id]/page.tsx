import PageBreadcrumbs from "@/app/ui/core/breadcrumbs";
import TaskDetails from "@/app/ui/tasks/task-details";
import { getSprint, getSprints } from "@/lib/db/sprint";
import { getTask, updateTask } from "@/lib/db/task";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: number } }) {
  const task = await getTask({ id: +params.id });
  if (!task) return notFound();

  const sprint = await getSprint({ id: task?.sprint_id });
  if (!sprint) return notFound();

  const sprints = await getSprints({ project_id: sprint.project_id });

  async function updateAction(form: FormData) {
    "use server";
    const task = Object.fromEntries(form.entries());
    await updateTask(task);
    revalidatePath(`/dashboard/tasks/${task.id}`);
  }

  const breadcrumbs = [
    { title: "Projects", link: "/dashboard/projects" },
    {
      title: sprint.project.title ?? "",
      link: `/dashboard/projects/${sprint.project.id}`,
    },
    {
      title: sprint.title ?? "",
      link: `/dashboard/projects/${sprint.project.id}`,
    },
    { title: task.title ?? "", link: undefined },
  ];

  return (
    <>
      <PageBreadcrumbs items={breadcrumbs} />
      <TaskDetails task={task} sprints={sprints} updateAction={updateAction} />
    </>
  );
}
