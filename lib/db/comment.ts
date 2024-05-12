import { Comment } from "@prisma/client";
import { CommentWithIncludes } from "./types";
import prisma from "./prisma";

/**
 * Adds comment to a task.
 * 
 * @param {Omit<Comment, "id">}params - Comment details
 * @returns {Promise<Comment>} - New comment
 */
export async function createComment(
  params: Omit<Comment, "id">
): Promise<Comment> {
  const comment = await prisma.comment.create({
    data: {
      ...params,
    },
  });
  return comment;
}

/**
 * Retrieves all comments for given task.
 * 
 * @param {number} taskId - Task ID
 * @returns - Task comments
 */
export async function getTaskComments(
  taskId: number
): Promise<CommentWithIncludes[]> {
  const comments = await prisma.comment.findMany({
    where: { task_id: taskId },
    include: { user: true },
  });
  return comments;
}

/**
 * Updates comment.
 *
 * @param {Partial<Comment>} params - Comment details
 * @returns {Promise<Comment>} - Updated comment
 */
export async function updateComment(
  params: Partial<Comment>
): Promise<Comment> {
  const comment = await prisma.comment.update({
    where: { id: params.id },
    data: { ...params },
  });
  return comment;
}

/**
 * Deletes comment.
 *
 * @param {number} id - Comment ID
 * @returns {Promise<Comment>} - Deleted comment
 */
export async function deleteComment(id: number): Promise<Comment> {
  const comment = await prisma.comment.delete({
    where: { id: id },
  });
  return comment;
}
