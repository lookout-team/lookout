import prisma from "./prisma";
import { Status } from "@prisma/client";

/**
 * Creates a new status.
 *
 * @export
 * @async
 * @param {string} name The name of the status.
 * @param {string} description The description of the status.
 * @returns {Promise<Status>} The created status object.
 */
export async function createStatus(
  name: string,
  description: string
): Promise<Status> {
  const status = await prisma.status.create({
    data: {
      name: name,
      description: description,
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
 * @returns {Promise<Status>} The deleted status object.
 */
export async function deleteStatus(id: number): Promise<Status> {
  const status = await prisma.status.delete({
    where: {
      id: id,
    },
  });
  return status;
}
