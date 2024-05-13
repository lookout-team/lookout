import { Priority } from "@prisma/client";
import prisma from "./prisma";

/**
 * Retrieves priorities.
 *
 * @param {Partial<Priority>} params - Priority parameters
 * @returns {Promise<Priority[]>} - Array of priorities
 */
export async function getPriorities(
  params?: Partial<Priority>
): Promise<Priority[]> {
  const priorities = await prisma.priority.findMany({
    where: { ...params },
  });
  return priorities;
}

/**
 * Creates a new priority.
 *
 * @param {string} name - Priority name
 * @param {string} description - Priority description
 * @returns {Promise<Priority>} - The created priority
 */
export async function createPriority(
  name: string,
  description: string
): Promise<Priority> {
  const priority = await prisma.priority.create({
    data: {
      name: name,
      description: description,
    },
  });
  return priority;
}

/**
 * Deletes a priority.
 *
 * @param {number} id - Priority ID
 * @returns {Promise<Priority>} - The deleted priority
 */
export async function deletePriority(id: number): Promise<Priority> {
  const priority = await prisma.priority.delete({
    where: {
      id: id,
    },
  });
  return priority;
}