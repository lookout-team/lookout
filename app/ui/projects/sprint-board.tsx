"use client";

import { Sprint, Task } from "@prisma/client";

export default function SprintBoard({
  sprint,
  tasks,
}: {
  sprint: Sprint;
  tasks: Task[];
}) {
  return <>TODO: Sprint Board</>;
}
