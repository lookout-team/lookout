"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Sprint, Task } from "@prisma/client";

export default function SprintTable({
  sprint,
  tasks,
}: {
  sprint: Sprint;
  tasks: Task[];
}) {
  const columns = ["Title", "Points", "Assigned To", "Status", "Priority"];

  const rows = tasks.map(task => (
    <TableRow>
      <TableCell>{task.title}</TableCell>
      <TableCell>{task.points}</TableCell>
      <TableCell>{task.assigned_to}</TableCell>
      <TableCell>{task.status_id}</TableCell>
      <TableCell>{task.priority_id}</TableCell>
    </TableRow>
  ));

  return (
    <>
      <div>
        <h1>{sprint.title}</h1>
      </div>
      <Table
        color="primary"
        selectionMode="single"
        defaultSelectedKeys={["2"]}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn>{column}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>{rows}</TableBody>
      </Table>
    </>
  );
}
