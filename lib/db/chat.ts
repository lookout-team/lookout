import { Chat } from "@prisma/client";
import { ChatWithIncludes, deleteConversationHistoryResult } from "./types";
import prisma from "./prisma";

export async function createChat(params: Chat): Promise<Chat> {
  const chat = await prisma.chat.create({
    data: {
      ...params,
    },
  });
  return chat;
}

export async function getChat(
  params: Partial<Chat>
): Promise<ChatWithIncludes | null> {
  const chat = await prisma.chat.findFirst({
    where: {
      ...params,
    },
    include: {
      user: true,
    },
  });
  return chat;
}

export async function getChats(
  params: Partial<Chat>
): Promise<ChatWithIncludes[]> {
  const chat = await prisma.chat.findMany({
    where: {
      ...params,
    },
    include: {
      user: true,
    },
  });
  return chat;
}

export async function updateChat(params: Partial<Chat>): Promise<Chat> {
  const chat = await prisma.chat.update({
    where: { id: params.id },
    data: { ...params },
  });
  return chat;
}

export async function deleteChat(id: number): Promise<Chat> {
  const chat = await prisma.chat.delete({
    where: { id: id },
  });
  return chat;
}

export async function updateChatStatus(
  id: number,
  status: string
): Promise<Chat> {
  const chat = await prisma.chat.update({
    where: { id: id },
    data: { status: status },
  });
  return chat;
}

export async function deleteConversationHistory(
  id: number
): Promise<deleteConversationHistoryResult> {
  const deleteChats = await prisma.chat.deleteMany({
    where: {
      user_id: id,
    },
  });
  return deleteChats;
}
