"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { TaskWithIncludes } from "@/lib/db/types";

interface ComponentProps {
  tasks: TaskWithIncludes[];
}

export default function SprintTable(props: ComponentProps) {
  const columns = ["Title", "Points", "Assigned To", "Status", "Priority"];

  const rows = props.tasks.map((task) => (
    <TableRow key={task.id}>
      <TableCell>{task.title}</TableCell>
      <TableCell>{task.points}</TableCell>
      <TableCell>{task.user?.username}</TableCell>
      <TableCell>{task.status?.name}</TableCell>
      <TableCell>{task.priority?.name}</TableCell>
    </TableRow>
  ));

  return (
    <>
      <Table color="primary" selectionMode="single">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column}>{column}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>{rows}</TableBody>
      </Table>
    </>
  );
}
