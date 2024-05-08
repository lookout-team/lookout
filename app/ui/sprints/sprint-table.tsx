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
  const columnTitles = ["Title", "Points", "Assigned To", "Status", "Priority"];

  const columns = columnTitles.map((column) => (
    <TableColumn key={column}>{column}</TableColumn>
  ));

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
        <TableHeader>{columns}</TableHeader>
        <TableBody>{rows}</TableBody>
      </Table>
    </>
  );
}
