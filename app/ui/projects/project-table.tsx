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
import ButtonModal from "../core/button-modal";
import ProjectForm from "./project-form";

interface ComponentProps {
  projects: Project[];
  editAction: (form: FormData) => Promise<void>;
  deleteAction: (form: FormData) => Promise<void>;
}

export default function ProjectTable(props: ComponentProps) {
  const router = useRouter();
  const pathname = usePathname();

  let rows = [];

  for (const project of props.projects) {
    let last_updated = "No activity yet";

    if (project.last_updated !== null) {
      last_updated = getDuration(project.last_updated);
    }

    const deleteModalBody = (
      <>
        <input type="hidden" name="id" value={project.id} />
        <p>
          Once deleted, this project and all of its associated sprints, tasks, and
          activity cannot be recovered. Are you sure?
        </p>
      </>
    );

    rows.push(
      <TableRow key={project.id} onClick={() => router.push(`${pathname}/${project.id}`)}>
        <TableCell>{project.title}</TableCell>
        <TableCell>{project.description}</TableCell>
        <TableCell>{project.current_sprint_id}</TableCell>
        <TableCell>{last_updated}</TableCell>
        <TableCell
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ButtonModal
            buttonChildren={<Pencil size={16} />}
            buttonVariant="light"
            modalTitle="Edit Project Details"
            modalBody={<ProjectForm project={project} />}
            confirmText="Save Changes"
            submitAction={props.editAction}
          />
        </TableCell>
        <TableCell
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ButtonModal
            buttonChildren={<Trash2 size={16} />}
            buttonVariant="light"
            modalTitle="Delete Project"
            modalBody={deleteModalBody}
            confirmText="Delete Project"
            submitAction={props.deleteAction}
          />
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
