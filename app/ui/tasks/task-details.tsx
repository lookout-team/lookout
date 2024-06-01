"use client";

import { TaskWithIncludes } from "@/lib/db/types";
import {
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Sprint, User } from "@prisma/client";
import { useState } from "react";
import Editable from "../core/editable";

interface ComponentProps {
  task: TaskWithIncludes;
  sprints: Sprint[];
  users: User[];
  updateAction: (form: FormData) => Promise<void>;
}

export default function TaskDetails(props: ComponentProps) {
  const task = props.task;
  const sprint = task.sprint;
  const users = props.users;
  const updateAction = props.updateAction;

  const [sprintId, setSprintId] = useState(`${sprint.id}`);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task?.description);
  const [category, setCategory] = useState(task?.category);
  const [priority, setPriority] = useState(`${task?.priority?.id}`);
  const [requirements, setRequirements] = useState(task?.requirements);
  const [criteria, setCriteria] = useState(task?.acceptance_criteria);
  const [points, setPoints] = useState(task?.points);
  const [assignee, setAssignee] = useState(`${task?.user?.id}`);

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
    <div className="mt-6 grid grid-cols-10 gap-6">
      <div className="col-span-7">
        <Editable
          itemId={task.id}
          initialValue={task.title}
          setValue={setTitle}
          itemName="title"
          itemLabel="Title"
          displayContent={<p className="text-3xl">{title}</p>}
          inputType="textarea"
          submitAction={updateAction}
        />
        <Editable
          itemId={task.id}
          initialValue={task.description}
          setValue={setDescription}
          itemName="description"
          itemLabel="Description"
          displayContent={
            <>
              <p className="text-xl font-medium mb-1">Description</p>
              <p className="text-md whitespace-break-spaces">{description}</p>
            </>
          }
          inputType="textarea"
          submitAction={updateAction}
        />
        <Editable
          itemId={task.id}
          initialValue={task.requirements}
          setValue={setRequirements}
          itemName="requirements"
          itemLabel="Requirements"
          displayContent={
            <>
              <p className="text-xl font-medium mb-1">Requirements</p>
              <p className="text-md whitespace-break-spaces">{requirements}</p>
            </>
          }
          inputType="textarea"
          submitAction={updateAction}
        />
        <Editable
          itemId={task.id}
          initialValue={task.acceptance_criteria}
          setValue={setCriteria}
          itemName="acceptance_criteria"
          itemLabel="Acceptance Criteria"
          displayContent={
            <>
              <p className="text-xl font-medium mb-1">Acceptance Criteria</p>
              <p className="text-md whitespace-break-spaces">{criteria}</p>
            </>
          }
          inputType="textarea"
          submitAction={updateAction}
        />
      </div>
      <div className="col-span-3">
        <Select
          label="Sprint"
          variant="bordered"
          name="sprint_id"
          className="w-full mb-4"
          selectedKeys={[`Sprint_${sprintId}`]}
          onChange={(e) => setSprintId(e.target.value)}
        >
          {props.sprints.map((sprint) => (
            <SelectItem key={`Sprint_${sprint.id}`} value={sprint.id}>
              {sprint.title}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Assignee"
          variant="bordered"
          className="w-full mb-4"
          name="user_id"
          selectedKeys={[`User_${assignee}`]}
          onChange={(e) => setAssignee(e.target.value)}
        >
          {users.map((user) => (
            <SelectItem key={`User_${user.id}`} value={user.id}>
              {`${user.first_name} ${user.last_name}`}
            </SelectItem>
          ))}
        </Select>
        <Input
          type="numeric"
          variant="bordered"
          label="Points"
          name="points"
          className="mb-4"
          value={points?.toString()}
          onChange={(e) => setPoints(+e.target.value)}
        />
        <RadioGroup
          className="ms-2 mb-4"
          name="category"
          label="Category"
          orientation="horizontal"
          value={category ?? "Story"}
          onValueChange={setCategory}
        >
          {categories.map((category) => (
            <Radio key={category} value={category}>
              {category}
            </Radio>
          ))}
        </RadioGroup>
        <RadioGroup
          className="ms-2 mb-4"
          label="Priority"
          orientation="horizontal"
          name="priority_id"
          value={priority}
          onValueChange={setPriority}
        >
          {priorities.map((priority) => (
            <Radio key={`Priority_${priority.id}`} value={priority.id}>
              {priority.name}
            </Radio>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
