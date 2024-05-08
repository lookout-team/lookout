"use client";

import { Sprint } from "@prisma/client";
import { TaskWithIncludes } from "@/lib/db/types";
import {
  Autocomplete,
  AutocompleteItem,
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
  const currentSprintId = sprints[0].id;

  const [sprintId, setSprintId] = useState(`${currentSprintId}`);
  const [title, setTitle] = useState(task?.title);
  const [description, setDescription] = useState(task?.description);
  const [category, setCategory] = useState(task?.category);
  const [priority, setPriority] = useState(task?.priority.name);
  const [requirements, setRequirements] = useState(task?.requirements);
  const [criteria, setCriteria] = useState(task?.acceptance_criteria);
  const [points, setPoints] = useState(task?.points);
  const [assignee, setAssignee] = useState(task?.user?.username);

  const users = ["Wasim Sandhu", "Winston Chan", "Joel Henningson"];
  const categories = ["Feature", "Epic", "Story", "Defect", "Spike", "Request"];
  const priorities = ["None", "Low", "Medium", "High", "Critical"];

  return (
    <>
      {task && <input type="hidden" name="id" value={task.id} />}
      <Autocomplete
        label="Sprint"
        variant="bordered"
        name=""
        className="w-full"
        value={sprintId}
        onValueChange={setSprintId}
      >
        {sprints.map((sprint) => (
          <AutocompleteItem key={sprint.id} value={sprint.id}>
            {sprint.title}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Input
        className="mb-2"
        variant="bordered"
        label="Title"
        name="title"
        value={title ?? undefined}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        className="mb-2"
        variant="bordered"
        label="Description"
        name="description"
        value={description ?? undefined}
        onChange={(e) => setDescription(e.target.value)}
      />
      <RadioGroup
        className="ms-2 mb-2"
        label="Category"
        orientation="horizontal"
        value={category ?? "Feature"}
        onValueChange={setCategory}
      >
        {categories.map((item) => (
          <Radio key={item} value={item}>
            {item}
          </Radio>
        ))}
      </RadioGroup>
      <RadioGroup
        className="ms-2 mb-2"
        label="Priority"
        orientation="horizontal"
        value={priority ?? "None"}
        onValueChange={setPriority}
      >
        {priorities.map((item) => (
          <Radio key={item} value={item}>
            {item}
          </Radio>
        ))}
      </RadioGroup>
      <Autocomplete
        label="Assignee"
        variant="bordered"
        className="w-full"
        value={assignee}
        onValueChange={setAssignee}
      >
        {users.map((user) => (
          <AutocompleteItem key={user}>{user}</AutocompleteItem>
        ))}
      </Autocomplete>
      <Textarea
        className="mb-2"
        variant="bordered"
        label="Requirements"
        name="requirements"
        value={requirements ?? undefined}
        onChange={(e) => setRequirements(e.target.value)}
      />
      <Textarea
        className="mb-2"
        variant="bordered"
        label="Acceptance Criteria"
        name="acceptance_criteria"
        value={criteria ?? undefined}
        onChange={(e) => setCriteria(e.target.value)}
      />
      <Input
        type="numeric"
        variant="bordered"
        label="Points"
        name="points"
        value={points?.toString()}
        onChange={(e) => setPoints(+e.target.value)}
      />
    </>
  );
}
