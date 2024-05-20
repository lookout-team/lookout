import ChatThread from "@/app/ui/assistant/chat-thread";
import { LookoutAssistant } from "@/lib/ai/assistant";
import { auth } from "@/lib/auth/auth";
import { getConversationHistory } from "@/lib/db/chat";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/signin");

  const conversation = await getConversationHistory(+userId);

  // const assistant = new LookoutAssistant();
  // assistant.initialize();

  return (
    <>
      <ChatThread conversation={conversation} />
    </>
  );
}
