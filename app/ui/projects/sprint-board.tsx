"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
} from "@nextui-org/react";
import { Prisma, Sprint } from "@prisma/client";
import SprintHeader from "./sprint-header";

type Task = Prisma.TaskGetPayload<{
  include: {
    user: true;
    status: true;
    priority: true;
  };
}>;

export default function SprintBoard({
  sprint,
  tasks,
}: {
  sprint: Sprint;
  tasks: Task[];
}) {
  // TODO: Get categories from database
  const statuses = ["To Do", "In Progress", "Completed"];

  function sortTasks() {}

  const statusColumns = statuses.map((status) => (
    <Card radius="sm" shadow="sm" className="border-1 w-96">
      <CardHeader className="font-medium">{status}</CardHeader>
      <Divider />
      <CardBody className="p-4">
        {tasks
          .filter((task) => task.status.name == status)
          .map((task) => (
            <Card shadow="sm" isHoverable isPressable disableAnimation>
              <CardHeader>
                {task.user.first_name} {task.user.last_name}
              </CardHeader>
              <Divider />
              <CardBody>{task.title}</CardBody>
              <Divider />
              <CardFooter>
                <div className="flex flex-row gap-2">
                  <Chip>{task.points}</Chip>
                  <Chip>{task.priority.name}</Chip>
                </div>
              </CardFooter>
            </Card>
          ))}
      </CardBody>
    </Card>
  ));

  return (
    <>
      <SprintHeader sprint={sprint} />
      <Card radius="sm" shadow="none" className="border-2">
        <CardBody>
          <div className="flex flex-row gap-4">{statusColumns}</div>
        </CardBody>
      </Card>
    </>
  );
}