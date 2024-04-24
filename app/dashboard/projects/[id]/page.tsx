import BacklogTable from "@/app/ui/projects/backlog-table";
import KanbanBoard from "@/app/ui/projects/kanban-board";
import ViewSelect from "@/app/ui/projects/view-select";

type QueryParams = {
  view: "board" | "table";
};

export default function Page({ searchParams }: { searchParams?: QueryParams }) {
  const selectedView = searchParams?.view ?? "table";

  return (
    <div className="grid grid-cols-10 gap-4">
      <div className="col-span-2">
        <ViewSelect selectedView={selectedView} />
      </div>
      <div className="mt-4 col-span-8">
        {selectedView == "table" ? <BacklogTable /> : <KanbanBoard />}
      </div>
    </div>
  );
}
