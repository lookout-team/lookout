import { start } from "repl";
import prisma from "./prisma";

/**
 * Retrieves a single task based on provided parameters.
 *
 * @export
 * @async
 * @param {Object} params Information about the task.
 * @param {number} params.id The ID of the task to retrieve.
 * @param {number} params.sprint_id The ID of the sprint the task belongs to.
 * @param {number} params.assigned_to The ID of the user assigned to the task.
 * @param {number} params.status_id The ID of the status of the task.
 * @param {string} params.title The title of the task.
 * @param {string} params.description The description of the task.
 * @param {string} params.requirements The requirements of the task.
 * @param {string} params.acceptance_criteria The acceptance criteria of the task.
 * @param {number} params.priority The priority of the task.
 * @param {number} params.points The points associated with the task.
 * @param {string} params.category The category of the task.
 * @returns {Promise<Object>}
 *} The retrieved task object.
 */
export async function getTask(params: any): Promise<Object | null> {
  const task = await prisma.task.findFirst({
    where: {
      id: params.id,
      sprint_id: params.sprint_id,
      assigned_to: params.assigned_to,
      status_id: params.status_id,
      title: params.title,
      description: params.description,
      requirements: params.requirements,
      acceptance_criteria: params.acceptance_criteria,
      priority: params.priority,
      points: params.points,
      category: params.category,
    },
    include: {
      user: true,
      activities: true,
      comments: true,
      status: true,
      sprint: true,
    },
  });
  return task;
}

/**
 * Retrieves multiple tasks based on provided parameters.
 *
 * @export
 * @async
 * @param {Object} params Information about the tasks to retrieve.
 * @param {number} params.id The ID of the task(s) to retrieve.
 * @param {number} params.sprint_id The ID of the sprint the task(s) belong to.
 * @param {number} params.assigned_to The ID of the user(s) assigned to the task(s).
 * @param {number} params.status_id The ID of the status of the task(s).
 * @param {string} params.title The title of the task(s).
 * @param {string} params.description The description of the task(s).
 * @param {string} params.requirements The requirements of the task(s).
 * @param {string} params.acceptance_criteria The acceptance criteria of the task(s).
 * @param {number} params.priority The priority of the task(s).
 * @param {number} params.points The points associated with the task(s).
 * @param {string} params.category The category of the task(s).
 * @returns {Promise<Object[]>} An array of retrieved task objects.
 */
export async function getTasks(params: any): Promise<Object[]> {
  const task = await prisma.task.findMany({
    where: {
      id: params.id,
      sprint_id: params.sprint_id,
      assigned_to: params.assigned_to,
      status_id: params.status_id,
      title: params.title,
      description: params.description,
      requirements: params.requirements,
      acceptance_criteria: params.acceptance_criteria,
      priority: params.priority,
      points: params.points,
      category: params.category,
    },
    include: {
      user: true,
      activities: true,
      comments: true,
      status: true,
      sprint: true,
    },
  });
  return task;
}

/**
 * Creates a new task.
 *
 * @export
 * @async
 * @param {Object} params Information about the task to create.
 * @param {string} params.title The title of the task.
 * @param {string} params.description The description of the task.
 * @param {string} params.category The category of the task.
 * @param {string} params.requirements The requirements of the task.
 * @param {string} params.acceptance_criteria The acceptance criteria of the task.
 * @param {number} params.points The points associated with the task.
 * @param {number} params.assigned_to The ID of the user assigned to the task.
 * @param {number} params.sprint_id The ID of the sprint the task belongs to.
 * @param {number} params.status_id The ID of the status of the task.
 * @param {number} params.priority_id The ID of the priority of the task.
 * @returns {Promise<Object>} The created task object.
 */
export async function createTask(params: any) {
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
 * @param {Object} params Information about the task to update.
 * @param {number} params.id The ID of the task to update.
 * @param {string} params.title The updated title of the task.
 * @param {string} params.description The updated description of the task.
 * @param {string} params.category The updated category of the task.
 * @param {string} params.requirements The updated requirements of the task.
 * @param {string} params.acceptance_criteria The updated acceptance criteria of the task.
 * @param {number} params.points The updated points associated with the task.
 * @param {number} params.assigned_to The updated ID of the user assigned to the task.
 * @param {number} params.status_id The updated ID of the status of the task.
 * @param {number} params.priority_id The updated ID of the priority of the task.
 * @returns {Promise<Object>} The updated task object.
 */
export async function updateTask(params: any) {
  const task = await prisma.task.update({
    where: { id: params.id },
    data: {
      title: params.title,
      description: params.description,
      category: params.category,
      requirements: params.requirements,
      acceptance_criteria: params.acceptance_criteria,
      points: params.points,
      assigned_to: params.assigned_to,
      status: params.status_id
        ? { connect: { id: params.status_id } }
        : undefined,
      priority: params.priority_id
        ? { connect: { id: params.priority_id } }
        : undefined,
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
 * @returns {Promise<Object>} The deleted task object.
 */
export async function deleteTask(id: any) {
  const task = await prisma.task.delete({
    where: {
      id: id,
    },
  });
  return task;
}
