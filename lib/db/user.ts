import { User } from "@prisma/client";
import prisma from "./prisma";
import { UserWithIncludes } from "./types";

export async function createUser(params: Omit<User, "id">): Promise<User> {
  const user = await prisma.user.create({
    data: {
      ...params,
    },
  });
  return user;
}

export async function getUser(
  params: Partial<User>
): Promise<UserWithIncludes | null> {
  const user = await prisma.user.findFirst({
    where: {
      ...params,
    },
    include: {
      task: true,
      activity: true,
      role: true,
      projects: true,
      comments: true,
      chats: true,
    },
  });
  return user;
}

export async function getUsers(
  params: Partial<User>
): Promise<UserWithIncludes[]> {
  const user = await prisma.user.findMany({
    where: {
      ...params,
    },
    include: {
      task: true,
      activity: true,
      role: true,
      projects: true,
      comments: true,
      chats: true,
    },
  });
  return user;
}

export async function updateUser(params: Partial<User>): Promise<User> {
  const user = await prisma.user.update({
    where: { id: params.id },
    data: { ...params },
  });
  return user;
}

export async function deleteUser(id: number): Promise<User> {
  const user = await prisma.user.delete({
    where: { id: id },
  });
  return user;
}
