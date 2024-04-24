import { Project } from "@prisma/client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <p className="text-lg">{project.title}</p>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="text-md">{project.description}</p>
      </CardBody>
      <Divider />
      <CardFooter>Footer text</CardFooter>
    </Card>
  );
}
