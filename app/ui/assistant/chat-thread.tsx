"use client";

import { Textarea } from "@nextui-org/react";
import { Chat } from "@prisma/client";
import { handleTextAreaSubmit } from "../utils";
import { useRef, useState } from "react";

interface Props {
  conversation: Chat[];
  handler: (form: FormData) => Promise<void>;
}

export default function ChatThread(props: Props) {
  const conversation = props.conversation;
  const messages = [];

  for (const exchange of conversation) {
    const message = (
      <div className="mb-4" key={`Message_${exchange.id}`}>
        <p className="text-lg font-medium">You</p>
        <p className="text-md">{exchange.message}</p>
      </div>
    );

    const response = (
      <div className="mb-4" key={`Response_${exchange.id}`}>
        <p className="text-lg font-medium">Lookout AI</p>
        <p className="text-md">{exchange.response}</p>
      </div>
    );

    messages.push(message);
    messages.push(response);
  }

  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 9rem)" }}>
      <div className="flex-grow">{messages}</div>
      <div>
        <form ref={formRef} action={props.handler}>
          <Textarea
            radius="lg"
            className="mt-4"
            variant="flat"
            placeholder="How can I help?"
            minRows={1}
            size="lg"
            name="message"
            value={message}
            onValueChange={setMessage}
            onKeyDown={(e) => handleTextAreaSubmit(e, formRef)}
          />
        </form>
      </div>
    </div>
  );
}
