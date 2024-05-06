"use client";

import { Project } from "@prisma/client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { getDuration } from "../utils";
import { Pencil, Trash2 } from "lucide-react";

export default function ProjectTable({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const pathname = usePathname();

  let rows = [];

  for (const project of projects) {
    let last_updated = "No activity yet";

    if (project.last_updated !== null) {
      last_updated = getDuration(project.last_updated);
    }

    rows.push(
      <TableRow onClick={() => router.push(`${pathname}/${project.id}`)}>
        <TableCell>{project.title}</TableCell>
        <TableCell>{project.description}</TableCell>
        <TableCell>{project.current_sprint_id}</TableCell>
        <TableCell>{last_updated}</TableCell>
        <TableCell>
          <Button size="sm" variant="light">
            <Pencil size={16} />
          </Button>
        </TableCell>
        <TableCell>
          <Button size="sm" variant="light">
            <Trash2 size={16} />
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Table color="primary" selectionMode="single">
      <TableHeader>
        <TableColumn>Title</TableColumn>
        <TableColumn>Description</TableColumn>
        <TableColumn>Current Sprint</TableColumn>
        <TableColumn>Last Updated</TableColumn>
        <TableColumn> </TableColumn>
        <TableColumn> </TableColumn>
      </TableHeader>
      <TableBody>{rows}</TableBody>
    </Table>
  );
}
