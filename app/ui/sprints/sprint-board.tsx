"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { TaskWithIncludes } from "@/lib/db/types";
import { Priority, Status } from "@prisma/client";
import TaskCard from "../tasks/task-card";

interface ComponentProps {
  tasks: TaskWithIncludes[];
  statuses: Status[];
  priorities: Priority[];
}

export default function SprintBoard(props: ComponentProps) {
  const statuses = props.statuses;

  const statusColumns = [];

  for (const status of statuses) {
    const taskCards = [];
    const filteredTasks = props.tasks.filter(
      (task) => task.status?.name == status.name
    );

    for (const task of filteredTasks) {
      taskCards.push(
        <TaskCard task={task} />
      );
    }

    statusColumns.push(
      <Card radius="sm" shadow="sm" className="border-1 w-96">
        <CardHeader className="font-medium">{status.name}</CardHeader>
        <Divider />
        <CardBody className="p-4">{taskCards}</CardBody>
      </Card>
    );
  }

  return <div className="flex flex-row gap-4 p-2">{statusColumns}</div>;
}
