import { Comment } from "@prisma/client";
import { CommentWithIncludes } from "./types";
import prisma from "./prisma";
import { createActivityLog } from "./activity";

/**
 * Adds comment to a task.
 *
 * @param {Omit<Comment, "id">}params - Comment details
 * @returns {Promise<Comment>} - New comment
 */
export async function createComment(
  params: Omit<Comment, "id" | "last_modified">
): Promise<Comment> {
  const comment = await prisma.comment.create({
    data: {
      ...params,
      last_modified: new Date(),
    },
  });
  await createActivityLog("Create", "comment", comment.id, params);
  return comment;
}

/**
 * Retrieves comments.
 *
 * @param {number} params - Query parameters
 * @returns - Array of comments
 */
export async function getComments(
  params?: Partial<Comment>
): Promise<CommentWithIncludes[]> {
  const comments = await prisma.comment.findMany({
    where: params,
    orderBy: { id: "desc" },
    include: { user: true, task: true },
  });
  return comments;
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
  return await getComments({ task_id: taskId });
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
    data: {
      ...params,
      last_modified: new Date(),
    },
  });
  await createActivityLog("Update", "comment", comment.id, params);
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
