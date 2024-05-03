"use client";

import { Sprint } from "@prisma/client";

export default function SprintHeader({ sprint }: { sprint: Sprint }) {
  return (
    <div className="mb-4">
      <h1 className="text-xl font-medium">{sprint.title}</h1>
      <div className="flex flex-row gap-4">
        <h2>Planned Capacity: {sprint.planned_capacity}</h2>
        <h2>Start: {sprint.start_date?.toDateString()}</h2>
        <h2>End: {sprint.end_date?.toDateString()}</h2>
      </div>
    </div>
  );
}
