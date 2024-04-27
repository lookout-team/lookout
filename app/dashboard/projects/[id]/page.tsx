import SprintTable from "@/app/ui/projects/sprint-table";
import SprintBoard from "@/app/ui/projects/sprint-board";
import ViewSelect from "@/app/ui/projects/view-select";
import prisma from "@/lib/db/prisma";

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

  const sprints = await prisma.sprint.findMany();
  const sprintComponents = [];

  for (const sprint of sprints) {
    const tasks = await prisma.task.findMany({
      include: {
        user: true,
        status: true,
        priority: true,
      },
    });

    const component = isTableView ? (
      <SprintTable key={sprint.id} sprint={sprint} tasks={tasks} />
    ) : (
      <SprintBoard key={sprint.id} sprint={sprint} tasks={tasks} />
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
