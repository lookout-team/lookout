"use client";

import { TaskWithIncludes } from "@/lib/db/types";
import {
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import { Sprint, User } from "@prisma/client";
import { useRef, useState } from "react";
import { handleTextAreaSubmit } from "../utils";
import { Pencil } from "lucide-react";

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

  const [isEditingTitle, setEditTitleFlag] = useState(false);
  const [isEditingDescription, setEditDescFlag] = useState(false);
  const [isEditingRequirements, setEditReqFlag] = useState(false);
  const [isEditingCriteria, setEditCriteriaFlag] = useState(false);

  const descriptionRef = useRef<HTMLFormElement>(null);
  const requirementsRef = useRef<HTMLFormElement>(null);
  const criteriaRef = useRef<HTMLFormElement>(null);

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

  const hiddenIdInput = task && (
    <input type="hidden" name="id" value={task.id} />
  );

  return (
    <div className="mt-6 grid grid-cols-10 gap-6">
      <div className="col-span-7">
        {isEditingTitle ? (
          <form action={updateAction} onSubmit={() => setEditTitleFlag(false)}>
            {hiddenIdInput}
            <Input
              size="lg"
              className="mb-4"
              variant="bordered"
              label="Title"
              name="title"
              value={title ?? undefined}
              onValueChange={setTitle}
            />
          </form>
        ) : (
          <Tooltip
            className="p-2"
            content={<Pencil size={20} />}
            placement="left-start"
            delay={250}
          >
            <div className="mb-4 rounded-md hover:cursor-pointer">
              <p className="text-3xl" onClick={() => setEditTitleFlag(true)}>
                {title}
              </p>
            </div>
          </Tooltip>
        )}
        {isEditingDescription ? (
          <form
            ref={descriptionRef}
            action={updateAction}
            onSubmit={() => setEditDescFlag(false)}
          >
            {hiddenIdInput}
            <Textarea
              size="lg"
              className="mb-4"
              variant="bordered"
              label="Description"
              name="description"
              value={description ?? undefined}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => handleTextAreaSubmit(e, descriptionRef)}
            />
          </form>
        ) : (
          <Tooltip
            className="p-2"
            content={<Pencil size={20} />}
            placement="left-start"
            delay={250}
          >
            <div
              className="mb-4 rounded-md hover:cursor-pointer"
              onClick={() => setEditDescFlag(true)}
            >
              <p className="text-xl font-medium mb-1">Description</p>
              <p className="text-md whitespace-break-spaces">{description}</p>
            </div>
          </Tooltip>
        )}
        {isEditingRequirements ? (
          <form
            ref={requirementsRef}
            action={updateAction}
            onSubmit={() => setEditReqFlag(false)}
          >
            {hiddenIdInput}
            <Textarea
              size="lg"
              className="mb-4"
              variant="bordered"
              label="Requirements"
              name="requirements"
              value={requirements ?? undefined}
              onChange={(e) => setRequirements(e.target.value)}
              onKeyDown={(e) => handleTextAreaSubmit(e, requirementsRef)}
            />
          </form>
        ) : (
          <Tooltip
            className="p-2"
            content={<Pencil size={20} />}
            placement="left-start"
            delay={250}
          >
            <div
              className="mb-4 rounded-md hover:cursor-pointer"
              onClick={() => setEditReqFlag(true)}
            >
              <p className="text-xl font-medium mb-1">Requirements</p>
              <p className="text-md whitespace-break-spaces">{requirements}</p>
            </div>
          </Tooltip>
        )}
        {isEditingCriteria ? (
          <form
            ref={criteriaRef}
            action={updateAction}
            onSubmit={() => setEditCriteriaFlag(false)}
          >
            {hiddenIdInput}
            <Textarea
              size="lg"
              className="mb-4"
              variant="bordered"
              label="Acceptance Criteria"
              name="acceptance_criteria"
              value={criteria ?? undefined}
              onChange={(e) => setCriteria(e.target.value)}
              onKeyDown={(e) => handleTextAreaSubmit(e, criteriaRef)}
            />
          </form>
        ) : (
          <Tooltip
            className="p-2"
            content={<Pencil size={20} />}
            placement="left-start"
            delay={250}
          >
            <div
              className="mb-4 rounded-md hover:cursor-pointer"
              onClick={() => setEditCriteriaFlag(true)}
            >
              <p className="text-xl font-medium mb-1">Acceptance Criteria</p>
              <p className="text-md whitespace-break-spaces">{criteria}</p>
            </div>
          </Tooltip>
        )}
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
