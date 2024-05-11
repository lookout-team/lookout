import prisma from "./prisma";
import { Status } from "@prisma/client";

/**
 * Retrieves statuses.
 *
 * @param {Partial<Status>} params - Status parameters
 * @returns {Promise<Status[]>} - Array of statuses
 */
export async function getStatuses(
  params?: Partial<Status>
): Promise<Status[]> {
  const statuses = await prisma.status.findMany({
    where: { ...params },
  });
  return statuses;
}

/**
 * Creates a new status.
 *
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