import ChatThread from "@/app/ui/assistant/chat-thread";
import assistant from "@/lib/ai/assistant";
import { auth } from "@/lib/auth/auth";
import { getConversationHistory, saveExchange } from "@/lib/db/chat";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.id) redirect("/signin");

  // Get past conversation history for user
  const userId = +user.id;
  const conversation = await getConversationHistory(userId);

  // Initialize a thread on the assistant for the user
  // TODO: Add middleware for deleting this thread when
  // user navigates away from /assistant
  if (!(userId in assistant.threads)) {
    await assistant.startConversation(userId);
  }

  /**
   * 1. Sends user's message to the OpenAI assistant
   * 2. Saves message and response in the database
   * 3. Revalidates cache to update chat thread in the UI
   */
  async function sendMessage(form: FormData) {
    "use server";
    const message = form.get("message")?.toString();
    if (!message || !userId) return;

    const response = await assistant.processUserInput(userId, message);
    await saveExchange(userId, message, response);
    revalidatePath("/dashboard/assistant");
  }

  return (
    <div className="sm:ms-10 sm:me-10 lg:ms-20 lg:me-20 xl:ms-40 xl:me-40">
      <ChatThread conversation={conversation} handler={sendMessage} />
    </div>
  );
}
