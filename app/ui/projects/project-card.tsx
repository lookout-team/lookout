"use client";

import { Project } from "@prisma/client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { getDuration } from "../utils";

export default function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const pathname = usePathname();

  let duration = "No activity yet...";

  if (project.last_updated !== null) {
    duration = getDuration(project.last_updated);
  }

  return (
    <Card
      className="max-w-[400px]"
      shadow="sm"
      isPressable
      isHoverable
      disableAnimation
      onClick={() => router.push(`${pathname}/${project.id}`)}
    >
      <CardHeader className="flex gap-3">
        <p className="text-lg font-medium">{project.title}</p>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="text-md">{project.description}</p>
      </CardBody>
      <Divider />
      <CardFooter>{duration}</CardFooter>
    </Card>
  );
}
