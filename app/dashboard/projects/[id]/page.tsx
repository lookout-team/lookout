import SprintTable from "@/app/ui/projects/sprint-table";
import SprintBoard from "@/app/ui/projects/sprint-board";
import ViewSelect from "@/app/ui/projects/view-select";
import { getSprints } from "@/lib/db/sprint";
import { getTasks } from "@/lib/db/task";

type QueryParams = {
  view: "board" | "table";
};

export default async function Page({
  searchParams,
}: {
  searchParams?: QueryParams;
}) {
  const selectedView = searchParams?.view ?? "table";
  const isTableView = selectedView == "table";

  const sprints = await getSprints();
  const sprintComponents = [];

  for (const sprint of sprints) {
    const tasks = await getTasks();

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
    <div className="grid grid-cols-10 gap-4">
      <div className="col-span-2">
        <ViewSelect selectedView={selectedView} />
      </div>
      <div className="mt-4 col-span-8">{sprintComponents}</div>
    </div>
  );
}
