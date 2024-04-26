import SprintTable from "@/app/ui/projects/sprint-table";
import SprintBoard from "@/app/ui/projects/sprint-board";
import ViewSelect from "@/app/ui/projects/view-select";
import { Sprint, Task } from "@prisma/client";

type QueryParams = {
  view: "board" | "table";
};

export default function Page({ searchParams }: { searchParams?: QueryParams }) {
  const selectedView = searchParams?.view ?? "table";
  const isTableView = selectedView == "table";

  const sprints: Sprint[] = [];
  const sprintComponents = [];

  for (const sprint of sprints) {
    const tasks: Task[] = [];

    const component = isTableView ? (
      <SprintTable sprint={sprint} tasks={tasks} />
    ) : (
      <SprintBoard sprint={sprint} tasks={tasks} />
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
