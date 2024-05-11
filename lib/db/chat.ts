import prisma from "./prisma";
import { Chat } from "@prisma/client";

/** TODO: Export from /lib/ai */
type AssistantResponse = {
  message: string;
  data: any;
  componentType: "table" | "card" | null;
  status: "pending" | "confirmed" | "canceled";
};

/**
 * Saves user exchange with AI Assistant.
 *
 * @param {number} userId - User ID
 * @param {string} message - User message
 * @param {AssistantResponse} response - Assistant response
 * @param {"read" | "write"} type - Either "read" or "write"
 * @returns {Promise<Chat>} - The saved exchange
 */
export async function saveExchange(
  userId: number,
  message: string,
  response: AssistantResponse,
  type: "read" | "write"
): Promise<Chat> {
  const responseData = JSON.stringify(response.data);

  const exchange = await prisma.chat.create({
    data: {
      user_id: userId,
      timestamp: new Date(),
      message: message,
      response: response.message,
      type: type,
      data: responseData,
      status: response.status,
    },
  });

  return exchange;
}

/**
 * Retrieves user's AI Assistant conversation history.
 *
 * @param {number} userId - User ID
 * @returns {Promise<Chat[]>} - Conversation history
 */
export async function getConversationHistory(userId: number): Promise<Chat[]> {
  const chat = await prisma.chat.findMany({
    where: {
      user_id: userId,
    },
  });
  return chat;
}

/**
 * Deletes user's AI Assistant conversation history.
 *
 * @param {number} userId - User ID
 * @returns {number} - Number of deleted exchanges.
 */
export async function deleteConversationHistory(
  userId: number
): Promise<{ count: number }> {
  const deletedChats = await prisma.chat.deleteMany({
    where: {
      user_id: userId,
    },
  });
  return deletedChats;
}
