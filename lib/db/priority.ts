import { Priority } from "@prisma/client";
import prisma from "./prisma";

/**
 * Creates a new priority.
 *
 * @export
 * @async
 * @param {string} name The name of the priority.
 * @param {string} description The description of the priority.
 * @returns {Promise<Priority>} The created priority object.
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
 * @export
 * @async
 * @param {number} id The ID of the priority to delete.
 * @returns {Promise<Priority>} The deleted priority object.
 */
export async function deletePriority(id: number): Promise<Priority> {
  const priority = await prisma.priority.delete({
    where: {
      id: id,
    },
  });
  return priority;
}
