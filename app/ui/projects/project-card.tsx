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

export default function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const pathname = usePathname();

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
      <CardFooter>Last updated 23 minutes ago</CardFooter>
    </Card>
  );
}
