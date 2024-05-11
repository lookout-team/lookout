"use client";

import { Sprint } from "@prisma/client";
import { TaskWithIncludes } from "@/lib/db/types";
import {
  Select,
  SelectItem,
  Input,
  Radio,
  RadioGroup,
  Textarea,
} from "@nextui-org/react";
import { useState } from "react";

interface ComponentProps {
  task?: TaskWithIncludes;
  sprints: Sprint[];
}

export default function TaskForm(props: ComponentProps) {
  const task = props.task;
  const sprints = props.sprints;
  const currentSprintId = sprints[0].id.toString();

  const [sprintId, setSprintId] = useState(currentSprintId);
  const [title, setTitle] = useState(task?.title);
  const [description, setDescription] = useState(task?.description);
  const [category, setCategory] = useState(task?.category);
  const [priority, setPriority] = useState(`${task?.priority.id}`);
  const [requirements, setRequirements] = useState(task?.requirements);
  const [criteria, setCriteria] = useState(task?.acceptance_criteria);
  const [points, setPoints] = useState(task?.points);
  const [assignee, setAssignee] = useState("1");

  const users = [
    { name: "Wasim Sandhu", id: 1 },
    { name: "Winston Chan", id: 2 },
    { name: "Joel Henningson", id: 3 },
  ];

  const categories = [
    "Story",
    "Feature",
    "Test",
    "Defect",
    "Spike",
    "Enhancement",
  ];

  const priorities = [
    { name: "None", id: "1" },
    { name: "Low", id: "2" },
    { name: "Medium", id: "3" },
    { name: "High", id: "4" },
    { name: "Critical", id: "5" },
  ];

  return (
    <>
      {task && <input type="hidden" name="id" value={task.id} />}
      <Select
        label="Sprint"
        variant="bordered"
        name="sprint_id"
        className="w-full mb-1"
        selectedKeys={sprintId}
        onChange={(e) => setAssignee(e.target.value)}
        isRequired={true}
      >
        {sprints.map((sprint) => (
          <SelectItem key={sprint.id} value={sprint.id}>
            {sprint.title}
          </SelectItem>
        ))}
      </Select>
      <Input
        className="mb-1"
        variant="bordered"
        label="Title"
        name="title"
        value={title ?? undefined}
        onChange={(e) => setTitle(e.target.value)}
        isRequired={true}
      />
      <Textarea
        className="mb-1"
        variant="bordered"
        label="Description"
        name="description"
        value={description ?? undefined}
        onChange={(e) => setDescription(e.target.value)}
        isRequired={true}
      />
      <RadioGroup
        className="ms-2 mb-1"
        name="category"
        label="Category"
        orientation="horizontal"
        value={category ?? "Story"}
        onValueChange={setCategory}
        isRequired={true}
      >
        {categories.map((category) => (
          <Radio key={category} value={category}>
            {category}
          </Radio>
        ))}
      </RadioGroup>
      <RadioGroup
        className="ms-2 mb-1"
        label="Priority"
        orientation="horizontal"
        name="priority_id"
        value={priority}
        onValueChange={setPriority}
        isRequired={true}
      >
        {priorities.map((priority) => (
          <Radio key={priority.id} value={priority.id}>
            {priority.name}
          </Radio>
        ))}
      </RadioGroup>
      <Select
        label="Assignee"
        variant="bordered"
        className="w-full mb-1"
        name="user_id"
        selectedKeys={assignee}
        onChange={(e) => setAssignee(e.target.value)}
        isRequired={true}
      >
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.name}
          </SelectItem>
        ))}
      </Select>
      <Input
        type="numeric"
        variant="bordered"
        label="Points"
        name="points"
        className="mb-1"
        value={points?.toString()}
        onChange={(e) => setPoints(+e.target.value)}
        isRequired={true}
      />
      <Textarea
        className="mb-1"
        variant="bordered"
        label="Requirements"
        name="requirements"
        value={requirements ?? undefined}
        onChange={(e) => setRequirements(e.target.value)}
      />
      <Textarea
        className="mb-1"
        variant="bordered"
        label="Acceptance Criteria"
        name="acceptance_criteria"
        value={criteria ?? undefined}
        onChange={(e) => setCriteria(e.target.value)}
      />
    </>
  );
}
