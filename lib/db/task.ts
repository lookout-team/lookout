import prisma from "./prisma";
import { Task } from "@prisma/client";
import { TaskWithIncludes } from "./types";
import { createActivityLog } from "./activity";
import { getSprint } from "./sprint";
import { getProject } from "./project";

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
  params?: Partial<Task>,
  order: "asc" | "desc" = "asc"
): Promise<TaskWithIncludes[]> {
  const task = await prisma.task.findMany({
    where: { ...params },
    orderBy: { id: order },
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
 * Retrieves a single task based on provided parameters.
 *
 * @param {Partial<Task>} params - Task details
 * @returns {Promise<Task | null>} - Task, if found
 */
export async function getTaskWithoutInclusions(
  params: Partial<Task>
): Promise<Task | null> {
  const task = await prisma.task.findFirst({
    where: params,
  });
  return task;
}

/**
 * Retrieves multiple tasks based on provided parameters.
 *
 * @param {Partial<Task>} params - Task details
 * @returns {Promise<Task[]>} - Task array
 */
export async function getTasksWithoutInclusions(
  params?: Partial<Task>,
  order: "asc" | "desc" = "asc"
): Promise<Task[]> {
  const task = await prisma.task.findMany({
    where: params,
    orderBy: { id: order },
  });
  return task;
}

/**
 * Creates a new task.
 *
 * @param {Omit<Task, "id">} params - Task details
 * @param {string} sprint_title - Sprint title (optional)
 * @param {string} project_title - Project title (optional)
 * @returns {Promise<Task>} - The created task
 */
export async function createTask(
  params: Omit<Task, "id">,
  sprint_title?: string,
  project_title?: string
): Promise<Task> {
  // OpenAI's assistant can't call functions sequentially in one run
  // So we make the additional queries ourselves
  if (project_title && sprint_title) {
    const project = await getProject({ title: project_title });
    const sprint = await getSprint({
      title: sprint_title,
      project_id: project!.id,
    });
    if (sprint) params.sprint_id = sprint?.id;
  }

  const task = await prisma.task.create({
    data: params,
  });

  await createActivityLog("Create", "task", task.id, params);
  return task;
}

/**
 * Updates an existing task.
 *
 * @param {Partial<Task>} params - Task details
 * @returns {Promise<Task>} - The updated task
 */
export async function updateTask(params: Partial<Task>): Promise<Task> {
  const ids = [
    "id",
    "sprint_id",
    "user_id",
    "status_id",
    "priority_id",
    "points",
  ];

  for (const id of ids) {
    if (typeof id === "string" && id in params) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      params[id] = +params[id];
    }
  }

  const task = await prisma.task.update({
    where: { id: params.id },
    data: {
      ...params,
    },
  });

  await createActivityLog("Update", "task", task.id, params);
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
