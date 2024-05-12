import prisma from "./prisma";
import { Task } from "@prisma/client";
import { TaskWithIncludes } from "./types";

/**
 * Retrieves a single task based on provided parameters.
 *
 * @param {Partial<Task>} params - Task details
 * @returns {Promise<TaskWithIncludes | null>} - Task, if found
 */
export async function getTask(
  params: Partial<Task>
): Promise<TaskWithIncludes | null> {
  const task = await prisma.task.findFirst({
    where: {
      ...params,
    },
    include: {
      user: true,
      activities: true,
      comments: true,
      status: true,
      sprint: true,
      priority: true,
    },
  });
  return task;
}

/**
 * Retrieves multiple tasks based on provided parameters.
 *
 * @param {Partial<Task>} params - Task details
 * @returns {Promise<TaskWithIncludes[]>} - Task array
 */
export async function getTasks(
  params?: Partial<Task>
): Promise<TaskWithIncludes[]> {
  const task = await prisma.task.findMany({
    where: {
      ...params,
    },
    include: {
      user: true,
      activities: true,
      comments: true,
      status: true,
      sprint: true,
      priority: true,
    },
  });
  return task;
}

/**
 * Creates a new task.
 *
 * @param {Omit<Task, "id">} params - Task details
 * @returns {Promise<Task>} - The created task
 */
export async function createTask(params: Omit<Task, "id">): Promise<Task> {
  const task = await prisma.task.create({
    data: {
      ...params,
    },
  });
  return task;
}

/**
 * Updates an existing task.
 *
 * @param {Partial<Task>} params - Task details
 * @returns {Promise<Task>} - The updated task
 */
export async function updateTask(params: Partial<Task>): Promise<Task> {
  if (typeof params.id === "string") {
    params.id = +params.id;
  }
  
  const task = await prisma.task.update({
    where: { id: params.id },
    data: {
      ...params,
    },
  });

  return task;
}

/**
 * Deletes a task.
 *
 * @param {number} id - Task ID
 * @returns {Promise<Task>} - The deleted task
 */
export async function deleteTask(id: number): Promise<Task> {
  const task = await prisma.task.delete({
    where: {
      id: id,
    },
  });
  return task;
}