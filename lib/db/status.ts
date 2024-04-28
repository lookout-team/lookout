import prisma from "./prisma";

/**
 * Creates a new status.
 *
 * @export
 * @async
 * @param {Object} params Information about the status to create.
 * @param {string} params.name The name of the status.
 * @param {string} params.description The description of the status.
 * @returns {Promise<Object>} The created status object.
 */
export async function createStatus(params: any) {
  const status = await prisma.status.create({
    data: {
      name: params.name,
      description: params.description,
    },
  });
  return status;
}

/**
 * Deletes a status.
 *
 * @export
 * @async
 * @param {number} id The ID of the status to delete.
 * @returns {Promise<Object>} The deleted status object.
 */
export async function deleteStatus(id: any) {
  const status = await prisma.status.delete({
    where: {
      id: id,
    },
  });
  return status;
}
