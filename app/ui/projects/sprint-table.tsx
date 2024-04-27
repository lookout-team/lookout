"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Sprint, Prisma } from "@prisma/client";
import SprintHeader from "./sprint-header";

type Task = Prisma.TaskGetPayload<{
  include: {
    user: true;
    status: true;
    priority: true;
  };
}>;

export default function SprintTable({
  sprint,
  tasks,
}: {
  sprint: Sprint;
  tasks: Task[];
}) {
  const columns = ["Title", "Points", "Assigned To", "Status", "Priority"];

  const rows = tasks.map((task) => (
    <TableRow>
      <TableCell>{task.title}</TableCell>
      <TableCell>{task.points}</TableCell>
      <TableCell>{task.user.username}</TableCell>
      <TableCell>{task.status.name}</TableCell>
      <TableCell>{task.priority.name}</TableCell>
    </TableRow>
  ));

  return (
    <>
      <SprintHeader sprint={sprint} />
      <Table color="primary" selectionMode="single" defaultSelectedKeys={["2"]}>
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
