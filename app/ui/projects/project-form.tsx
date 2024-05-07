"use client";

import { Input } from "@nextui-org/react";
import { Project } from "@prisma/client";
import { useState } from "react";

export default function ProjectForm({ project }: { project?: Project }) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");

  return (
    <>
      {project && <input type="hidden" name="id" value={project.id} /> }
      <Input
        className="mb-4"
        variant="bordered"
        label="Title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        variant="bordered"
        label="Description"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </>
  );
}
