"use client";

import { Progress, Textarea } from "@nextui-org/react";
import { Chat } from "@prisma/client";
import { handleTextAreaSubmit } from "../utils";
import { useEffect, useRef, useState } from "react";
import DataComponent from "./data-component";
import ButtonModal from "../core/button-modal";
import { Trash2 } from "lucide-react";

interface Props {
  conversation: Chat[];
  sendMessageAction: (form: FormData) => Promise<void>;
  deleteMessagesAction: () => Promise<void>;
}

export default function ChatThread(props: Props) {
  const [message, setMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  let i = -1;
  let messages = [];
  const conversation = props.conversation;

  for (const exchange of conversation) {
    i++;

    if (
      exchange.message !== "Confirm action" &&
      exchange.message !== "Cancel action"
    ) {
      const message = (
        <div className="mb-4" key={`Message_${exchange.id}`}>
          <p className="text-lg font-medium">You</p>
          <p className="text-md">{exchange.message}</p>
        </div>
      );

      messages.push(message);
    }

    const response = (
      <div className="mb-4" key={`Response_${exchange.id}`}>
        <p className="text-lg font-medium">Lookout AI</p>
        <p className="text-md">{exchange.response}</p>
      </div>
    );

    messages.push(response);

    if (exchange.data === "null" || exchange.data === "[{}]") continue;
    const data = JSON.parse(exchange.data);

    const dataComponent = (
      <div className="mb-4" key={`Data_${exchange.id}`}>
        <DataComponent
          data={data}
          status={exchange.status}
          type={exchange.type}
          buttonAction={handleButtonAction}
          isActionable={i === conversation.length - 1}
        />
      </div>
    );

    messages.push(dataComponent);
  }

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    setIsThinking(false);
  }, [props.conversation]);

  function handleButtonAction(action: string) {
    const formData = new FormData();
    formData.set("message", action);
    props.sendMessageAction(formData);
    setIsThinking(true);
    setMessage("");
  }

  function handleSubmit(e: any) {
    if (!(e.key === "Enter" && !e.shiftKey)) return;
    handleTextAreaSubmit(e, formRef);
    setIsThinking(true);
    setMessage("");
  }

  return (
    <div className="flex flex-col">
      <div className="grow">
        {messages}
        {isThinking && (
          <Progress
            size="sm"
            isIndeterminate
            aria-label="Loading..."
            className="w-full"
          />
        )}
      </div>
      <div className="mt-4 grid grid-cols-12">
        <div className="col-span-11">
          <form ref={formRef} action={props.sendMessageAction}>
            <Textarea
              className="w-full"
              ref={textAreaRef}
              radius="lg"
              variant="flat"
              placeholder={
                isThinking ? "Thinking, one sec..." : "How can I help?"
              }
              minRows={1}
              size="lg"
              name="message"
              value={message}
              onValueChange={setMessage}
              onKeyDown={(e) => handleSubmit(e)}
            />
          </form>
        </div>
        <div className="col-span-1 flex flex-row items-center">
          <ButtonModal
            buttonChildren={<Trash2 size={24} />}
            buttonColor="default"
            buttonVariant="light"
            modalTitle="Clear Conversation History?"
            modalBody="This will permanently delete your messages with Lookout AI."
            confirmText="Clear my conversation history"
            confirmColor="danger"
            submitAction={props.deleteMessagesAction}
          />
        </div>
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}
