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
