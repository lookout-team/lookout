import PageBreadcrumbs from "@/app/ui/core/breadcrumbs";
import { getSprint } from "@/lib/db/sprint";
import { getTask } from "@/lib/db/task";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: number } }) {
  const task = await getTask({ id: +params.id });
  if (!task) return notFound();

  const sprint = await getSprint({ id: task?.sprint_id });
  if (!sprint) return notFound();

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
      <div className="grid grid-cols-10 gap-6">
        <div className="col-span-2"></div>
        <div className="mt-4 col-span-8"></div>
      </div>
    </>
  );
}
