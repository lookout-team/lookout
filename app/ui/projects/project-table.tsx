"use client";

import { Project } from "@prisma/client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { getDuration } from "../utils";

export default function ProjectTable({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const pathname = usePathname();

  let columns = ["Title", "Description", "Current Sprint", "Last Updated"];
  let rows = [];

  for (const project of projects) {
    let last_updated = "No activity yet...";

    if (project.last_updated !== null) {
      last_updated = getDuration(project.last_updated);
    }

    rows.push(
      <TableRow onClick={() => router.push(`${pathname}/${project.id}`)}>
        <TableCell>{project.title}</TableCell>
        <TableCell>{project.description}</TableCell>
        <TableCell>{project.current_sprint_id}</TableCell>
        <TableCell>{last_updated}</TableCell>
      </TableRow>
    );
  }

  return (
    <Table color="primary" selectionMode="single">
      <TableHeader>
        {columns.map((column) => (
          <TableColumn>{column}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>{rows}</TableBody>
    </Table>
  );
}
