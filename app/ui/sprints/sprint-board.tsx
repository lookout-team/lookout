"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
} from "@nextui-org/react";
import SprintHeader from "./sprint-header";
import { TaskWithIncludes } from "@/lib/db/types";
import { Sprint } from "@prisma/client";

export default function SprintBoard({
  sprint,
  tasks,
}: {
  sprint: Sprint;
  tasks: TaskWithIncludes[];
}) {
  const statuses = ["To Do", "In Progress", "Completed"];

  const statusColumns = statuses.map((status) => (
    <Card radius="sm" shadow="sm" className="border-1 w-96">
      <CardHeader className="font-medium">{status}</CardHeader>
      <Divider />
      <CardBody className="p-4 bg-slate-50">
        {tasks
          .filter((task) => task.status.name == status)
          .map((task) => (
            <Card className="mt-2 mb-2" shadow="sm" isHoverable isPressable>
              <CardHeader>
                {/* {task.user?.first_name} {task.user?.last_name} */}
                John Doe
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
      <Card radius="sm" shadow="none" className="border-2 p-4">
        <CardBody>
          <div className="flex flex-row gap-4">{statusColumns}</div>
        </CardBody>
      </Card>
    </>
  );
}
