"use client";

import { TaskWithIncludes } from "@/lib/db/types";
import { Priority, Sprint, Status, User } from "@prisma/client";
import { useState } from "react";
import Editable from "../core/editable";

interface ComponentProps {
  task: TaskWithIncludes;
  sprints: Sprint[];
  users: User[];
  statuses: Status[];
  priorities: Priority[];
  updateAction: (form: FormData) => Promise<void>;
}

export default function TaskDetails(props: ComponentProps) {
  const task = props.task;
  const sprint = task.sprint;
  const users = props.users;
  const updateAction = props.updateAction;

  // I'm sorry :')
  const categories = [
    { id: "Story", name: "Story" },
    { id: "Feature", name: "Feature" },
    { id: "Test", name: "Test" },
    { id: "Defect", name: "Defect" },
    { id: "Spike", name: "Spike" },
    { id: "Enhancement", name: "Enhancement" },
  ];

  const [sprintId, setSprintId] = useState(`${sprint!.id}`);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task?.description);
  const [category, setCategory] = useState(task?.category);
  const [status, setStatus] = useState(`${task?.status_id}`);
  const [priority, setPriority] = useState(`${task?.priority?.id}`);
  const [requirements, setRequirements] = useState(task?.requirements);
  const [criteria, setCriteria] = useState(task?.acceptance_criteria);
  const [points, setPoints] = useState(`${task?.points}`);
  const [assignee, setAssignee] = useState(`${task?.user?.id}`);

  return (
    <div className="mt-6 grid grid-cols-10 gap-6">
      <div className="col-span-7">
        <Editable
          itemId={task.id}
          initialValue={title}
          setValue={setTitle}
          itemName="title"
          itemLabel="Title"
          displayContent={<p className="text-3xl">{title}</p>}
          inputType="textarea"
          submitAction={updateAction}
        />
        <Editable
          itemId={task.id}
          initialValue={description}
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
          initialValue={requirements}
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
          initialValue={criteria}
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
        <Editable
          itemId={task.id}
          initialValue={sprintId}
          setValue={setSprintId}
          itemName="sprint_id"
          itemLabel="Sprint"
          itemList={props.sprints}
          displayProp="title"
          displayContent={
            <>
              <p className="mb-1 text-lg font-medium">Sprint</p>
              <p className="text-md">
                {task.sprint!.title} (Ends {task.sprint!.end_date?.toDateString()}
                )
              </p>
            </>
          }
          inputType="select"
          submitAction={updateAction}
        />
        <Editable
          itemId={task.id}
          initialValue={assignee}
          setValue={setAssignee}
          itemName="user_id"
          itemLabel="Assigned To"
          itemList={users}
          displayProp="username"
          displayContent={
            <>
              <p className="mb-1 text-lg font-medium">Assigned To</p>
              <p className="text-md">
                @{task.user?.username ?? "Currently unassigned"}
              </p>
            </>
          }
          inputType="select"
          submitAction={updateAction}
        />
        <Editable
          itemId={task.id}
          initialValue={points}
          setValue={setPoints}
          itemName="points"
          itemLabel="Story Points"
          displayContent={
            <>
              <p className="mb-1 text-lg font-medium">Story Points</p>
              <p className="text-md">{points}</p>
            </>
          }
          inputType="textarea"
          submitAction={updateAction}
        />
        <Editable
          itemId={task.id}
          initialValue={category}
          setValue={setCategory}
          itemName="category"
          itemLabel="Category"
          itemList={categories}
          displayProp="name"
          displayContent={
            <>
              <p className="mb-1 text-lg font-medium">Category</p>
              <p className="text-md">{category}</p>
            </>
          }
          inputType="select"
          submitAction={updateAction}
        />
        <Editable
          itemId={task.id}
          initialValue={priority}
          setValue={setPriority}
          itemName="priority_id"
          itemLabel="Priority"
          itemList={props.priorities}
          displayProp="name"
          displayContent={
            <>
              <p className="mb-1 text-lg font-medium">Priority</p>
              <p className="text-md">{task.priority!.name}</p>
            </>
          }
          inputType="select"
          submitAction={updateAction}
        />
        <Editable
          itemId={task.id}
          initialValue={status}
          setValue={setStatus}
          itemName="status_id"
          itemLabel="Status"
          itemList={props.statuses}
          displayProp="name"
          displayContent={
            <>
              <p className="mb-1 text-lg font-medium">Status</p>
              <p className="text-md">{task.status!.name}</p>
            </>
          }
          inputType="select"
          submitAction={updateAction}
        />
      </div>
    </div>
  );
}
