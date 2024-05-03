import SprintTable from "@/app/ui/projects/sprint-table";
import SprintBoard from "@/app/ui/projects/sprint-board";
import ViewSelect from "@/app/ui/projects/view-select";
import { getSprints } from "@/lib/db/sprint";
import { getTasks } from "@/lib/db/task";
import { getProject } from "@/lib/db/project";
import { notFound } from "next/navigation";

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
  const selectedView = searchParams?.view ?? "table";
  const isTableView = selectedView == "table";

  const project = await getProject(+params.id);
  if (!project) return notFound();

  const sprints = await getSprints({ project_id: project?.id });
  const sprintComponents = [];

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

  return (
    <>
      <div className="grid grid-cols-10 gap-4">
        <div className="col-span-2">
          <ViewSelect selectedView={selectedView} />
        </div>
        <div className="mt-4 col-span-8">{sprintComponents}</div>
      </div>
    </>
  );
}
