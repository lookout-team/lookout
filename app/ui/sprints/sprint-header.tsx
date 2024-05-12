"use client";

import { Sprint } from "@prisma/client";
import ButtonModal from "../core/button-modal";
import SprintForm from "./sprint-form";
import { Pencil, Trash2 } from "lucide-react";

interface ComponentProps {
  sprint: Sprint;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}

export default function SprintHeader(props: ComponentProps) {
  const sprint = props.sprint;

  const deleteModalForm = (
    <>
      <input type="hidden" name="id" value={sprint.id} />
      <p>
        Once deleted, this sprint and all of its associated tasks cannot be
        recovered. Are you sure?
      </p>
    </>
  );

  return (
    <div className="flex justify-between items-end mb-4">
      <div>
        <h1 className="text-xl font-medium">{sprint.title}</h1>
        <div className="flex flex-row gap-5">
          <h2>Planned Capacity: {sprint.planned_capacity}</h2>
          <h2>Starts: {sprint.start_date?.toDateString()}</h2>
          <h2>Ends: {sprint.end_date?.toDateString()}</h2>
        </div>
      </div>
      <div className="flex items-row">
        <ButtonModal
          buttonChildren={<Pencil size={20} />}
          buttonVariant="light"
          buttonSize="md"
          buttonColor="default"
          modalTitle={`Edit ${sprint.title}`}
          modalBody={<SprintForm sprint={sprint} />}
          submitAction={props.updateAction}
        />
        <ButtonModal
          buttonChildren={<Trash2 size={20} />}
          buttonVariant="light"
          buttonSize="md"
          buttonColor="danger"
          modalTitle={`Delete ${sprint.title}`}
          modalBody={deleteModalForm}
          submitAction={props.deleteAction}
        />
      </div>
    </div>
  );
}
