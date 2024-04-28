import prisma from "./prisma";

/**
 * Creates a new priority.
 *
 * @export
 * @async
 * @param {Object} params Information about the priority to create.
 * @param {string} params.name The name of the priority.
 * @param {string} params.description The description of the priority.
 * @returns {Promise<Object>} The created priority object.
 */
export async function createPriority(params: any) {
  const priority = await prisma.priority.create({
    data: {
      name: params.name,
      description: params.description,
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
 * @returns {Promise<Object>} The deleted priority object.
 */
export async function deletePriority(id: any) {
  const priority = await prisma.priority.delete({
    where: {
      id: id,
    },
  });
  return priority;
}
