"use client";

import { Textarea } from "@nextui-org/react";
import { Chat } from "@prisma/client";

interface Props {
  conversation: Chat[];
}

export default function ChatThread(props: Props) {
  const conversation = props.conversation;
  const messages = [];

  for (const exchange of conversation) {
    const message = (
      <>
        <p className="text-2xl">You</p>
        <p className="text-lg">{exchange.message}</p>
      </>
    );

    const response = (
      <>
        <p className="text-2xl">Lookout AI</p>
        <p className="text-lg">{exchange.response}</p>
      </>
    );

    messages.push(message);
    messages.push(response);
  }

  return (
    <div className="flex flex-col ms-20 me-20" style={{ height: "calc(100vh - 9rem)" }}>
      <div className="flex-grow">{messages}</div>
      <div>
        <Textarea
          className="mt-4"
          variant="faded"
          label="How can I help?"
          minRows={2}
        />
      </div>
    </div>
  );
}
