"use client";

import { CommentWithIncludes } from "@/lib/db/types";
import { Card, Link, Textarea, Tooltip } from "@nextui-org/react";
import { getDuration, handleTextAreaSubmit } from "../utils";
import { useRef, useState } from "react";
import { Pencil } from "lucide-react";

interface Props {
  comment: CommentWithIncludes;
  updateAction?: (form: FormData) => Promise<void>;
  deleteAction?: (form: FormData) => Promise<void>;
  isEditable: boolean;
}

export default function CommentCard(props: Props) {
  const { comment, isEditable } = props;
  const [text, setText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const commentCard = (
    <Card shadow="none" className="mt-4">
      <p className="font-medium mt-1">@{comment.user.username}</p>
      {!isEditable && (
        <Link color="foreground" href={`/dashboard/tasks/${comment.task_id}`}>
          <p className="mt-1 text-sm font-medium">{comment.task.title}</p>
        </Link>
      )}
      <p className="mt-1 whitespace-break-spaces">{comment.text}</p>
      <p className="mt-1 text-sm">{getDuration(comment.last_modified!)}</p>
    </Card>
  );

  function handleSubmit(e: any) {
    if (!(e.key === "Enter" && !e.shiftKey)) return;
    handleTextAreaSubmit(e, formRef);
    setText("");
  }

  return isEditable ? (
    isEditing ? (
      <form
        ref={formRef}
        action={props.updateAction}
        onSubmit={() => setIsEditing(false)}
      >
        <input type="hidden" name="id" value={comment.id} />
        <Textarea
          className="mt-4"
          name="comment"
          variant="bordered"
          value={text}
          onValueChange={setText}
          onKeyDown={(e) => handleSubmit(e)}
        />
      </form>
    ) : (
      <Tooltip
        className="mt-1 p-2"
        content={<Pencil size={20} />}
        placement="left-start"
        delay={250}
      >
        <div
          className="hover:cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {commentCard}
        </div>
      </Tooltip>
    )
  ) : (
    commentCard
  );
}
