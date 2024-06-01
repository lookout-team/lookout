"use client";

import { TaskWithIncludes } from "@/lib/db/types";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  CardFooter,
  Chip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function TaskCard({ task }: { task: TaskWithIncludes }) {
  const router = useRouter();

  return (
    <Card
      className="mt-2 mb-4 border-1"
      shadow="none"
      isHoverable
      isPressable
      disableAnimation
      onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
    >
      <CardHeader>
        <div>
          <h1>
            {task.user?.first_name} {task.user?.last_name}
          </h1>
          <h2 className="ms-1 text-gray-500">@{task.user?.username}</h2>
        </div>
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
