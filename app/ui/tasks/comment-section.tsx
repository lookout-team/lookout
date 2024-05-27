"use client";

import { CommentWithIncludes } from "@/lib/db/types";
import CommentCard from "./comment-card";
import { MessageCircleDashed } from "lucide-react";
import { Textarea } from "@nextui-org/react";
import { handleTextAreaSubmit } from "../utils";
import { useRef, useState } from "react";

interface Props {
  comments: CommentWithIncludes[];
  userId?: number;
  createAction?: (form: FormData) => Promise<void>;
  updateAction?: (form: FormData) => Promise<void>;
  deleteAction?: (form: FormData) => Promise<void>;
}

export default function CommentSection(props: Props) {
  const comments = props.comments;
  const [comment, setComment] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: any) {
    if (!(e.key === "Enter" && !e.shiftKey)) return;
    handleTextAreaSubmit(e, formRef);
    setComment("");
  }

  return (
    <div>
      {props.createAction && (
        <form ref={formRef} action={props.createAction}>
          <Textarea
            name="comment"
            variant="bordered"
            placeholder="Leave a comment..."
            value={comment}
            onValueChange={setComment}
            minRows={1}
            onKeyDown={(e) => handleSubmit(e)}
          />
        </form>
      )}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={`Comment_${comment.id}`}>
            <CommentCard
              comment={comment}
              updateAction={props.updateAction}
              deleteAction={props.deleteAction}
              isEditable={props.userId === comment.user_id}
            />
          </div>
        ))
      ) : (
        <div className="flex items-center place-content-center opacity-75 h-20">
          <MessageCircleDashed size={28} className="me-2" />
          <h1 className="text-md">No comments yet!</h1>
        </div>
      )}
    </div>
  );
}
