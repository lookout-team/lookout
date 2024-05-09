import { Comment } from "@prisma/client";
import { CommentWithIncludes } from "./types";
import prisma from "./prisma";

export async function createComment(params: Comment): Promise<Comment> {
  const comment = await prisma.comment.create({
    data: {
      ...params,
    },
  });
  return comment;
}

export async function getComment(
  params: Partial<Comment>
): Promise<CommentWithIncludes | null> {
  const comment = await prisma.comment.findFirst({
    where: {
      ...params,
    },
    include: {
      user: true,
      task: true,
    },
  });
  return comment;
}

export async function getComments(
  params: Partial<Comment>
): Promise<CommentWithIncludes[]> {
  const comment = await prisma.comment.findMany({
    where: {
      ...params,
    },
    include: {
      user: true,
      task: true,
    },
  });
  return comment;
}

export async function updateComment(
  params: Partial<Comment>
): Promise<Comment> {
  const comment = await prisma.comment.update({
    where: { id: params.id },
    data: { ...params },
  });
  return comment;
}

export async function deleteActivity(id: number): Promise<Comment> {
  const comment = await prisma.comment.delete({
    where: { id: id },
  });
  return comment;
}
