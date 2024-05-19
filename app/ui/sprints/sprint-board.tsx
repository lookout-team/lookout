"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
} from "@nextui-org/react";
import { TaskWithIncludes } from "@/lib/db/types";
import { Priority, Status } from "@prisma/client";

interface ComponentProps {
  tasks: TaskWithIncludes[];
  statuses: Status[];
  priorities: Priority[];
}

export default function SprintBoard(props: ComponentProps) {
  const statuses = props.statuses;
  const priorities = props.priorities;

  const statusColumns = [];

  for (const status of statuses) {
    const taskCards = [];
    const filteredTasks = props.tasks.filter(
      (task) => task.status?.name == status.name
    );

    for (const task of filteredTasks) {
      taskCards.push(
        <Card className="mt-2 mb-4" shadow="sm" isHoverable isPressable>
          <CardHeader>
            <span>
              {task.user?.first_name} {task.user?.last_name}
            </span>
            <span className="ms-2 text-gray-500">@{task.user?.username}</span>
          </CardHeader>
          <Divider />
          <CardBody>{task.title}</CardBody>
          <Divider />
          <CardFooter>
            <div className="flex flex-row gap-2">
              <Chip className="bg-primary-200">{task.points}</Chip>
              <Chip className="bg-green-200">{task.category}</Chip>
              <Chip className="bg-red-200">{task.priority?.name}</Chip>
            </div>
          </CardFooter>
        </Card>
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
