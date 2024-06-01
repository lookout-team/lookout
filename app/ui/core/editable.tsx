"use client";

import { Textarea, Tooltip } from "@nextui-org/react";
import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { handleTextAreaSubmit } from "../utils";

interface Props {
  initialValue: any;
  setValue: any;
  itemId: number;
  itemName: string;
  itemLabel: string;
  displayContent: any;
  inputType: "textarea" | "select" | "radio";
  submitAction: (form: FormData) => Promise<void>;
}

export default function Editable(props: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [value, setValue] = useState(props.initialValue);
  const [isEditing, setEditing] = useState(false);

  useEffect(() => {
    const handleEsc = (event: any) => {
      if (event.key === "Escape") {
        setEditing(false);
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  function propagateSetValue() {
    setEditing(false);
    props.setValue(value);
  }

  let inputElement = <></>;

  switch (props.inputType) {
    case "textarea":
      inputElement = (
        <Textarea
          size="lg"
          className="mb-4"
          variant="bordered"
          name={props.itemName}
          label={props.itemLabel}
          value={value ?? undefined}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => handleTextAreaSubmit(e, formRef)}
        />
      );
  }

  return isEditing ? (
    <form
      ref={formRef}
      action={props.submitAction}
      onSubmit={() => propagateSetValue()}
    >
      <input type="hidden" name="id" value={props.itemId} />
      {inputElement}
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
        onClick={() => setEditing(true)}
      >
        {props.displayContent}
      </div>
    </Tooltip>
  );
}
