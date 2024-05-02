import { start } from "repl";
import prisma from "./prisma";
import { Task } from "@prisma/client";
import { TaskWithIncludes } from "./types";

/**
 * Retrieves a single task based on provided parameters.
 *
 * @export
 * @async
 * @param {Partial<Task>} params Information about the task.
 * @returns {Promise<TaskWithIncludes | null>}
 *} The retrieved task object.
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
 * @export
 * @async
 * @param {Partial<Task>} params Information about the tasks to retrieve.
 * @returns {Promise<TaskWithIncludes[]>} An array of retrieved task objects.
 */
export async function getTasks(
  params: Partial<Task>
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
 * @export
 * @async
 * @param {Partial<Task>} params Information about the task to create.
 * @returns {Promise<Task>} The created task object.
 */
export async function createTask(params: any): Promise<Task> {
  const task = await prisma.task.create({
    data: {
      title: params.title,
      description: params.description,
      category: params.category,
      requirements: params.requirements,
      acceptance_criteria: params.acceptance_criteria,
      points: params.points,
      assigned_to: params.assigned_to,
      sprint: { connect: { id: params.sprint_id } },
      status: { connect: { id: params.status_id } },
      priority: { connect: { id: params.priority_id } },
    },
  });
  return task;
}

/**
 * Updates an existing task.
 *
 * @export
 * @async
 * @param {Partial<Task>} params Information about the task to update.
 * @returns {Promise<Task>} The updated task object.
 */
export async function updateTask(params: Partial<Task>): Promise<Task> {
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
 * @export
 * @async
 * @param {number} id The ID of the task to delete.
 * @returns {Promise<Task>} The deleted task object.
 */
export async function deleteTask(id: number): Promise<Task> {
  const task = await prisma.task.delete({
    where: {
      id: id,
    },
  });
  return task;
}
