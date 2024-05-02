import prisma from "./prisma";
import { Sprint } from "@prisma/client";
import { SprintWithIncludes } from "./types";

/**
 * Retrieves a single sprint based on provided parameters.
 *
 * @export
 * @async
 * @param {Sprint} params
 * @returns {Promise<SprintWithIncludes | null>} The retrieved sprint object or null
 */
export async function getSprint(
  params: Partial<Sprint>
): Promise<SprintWithIncludes | null> {
  const sprint = await prisma.sprint.findFirst({
    where: {
      ...params,
    },
    include: { tasks: true },
  });
  return sprint;
}

/**
 * Retrieves multiple sprints based on provided parameters.
 *
 * @export
 * @async
 * @param {Sprint} params
 * @returns {Promise<SprintWithIncludes[]>} An array of retrieved sprint objects.
 */
export async function getSprints(
  params?: Partial<Sprint>
): Promise<SprintWithIncludes[]> {
  const sprints = await prisma.sprint.findMany({
    where: {
      ...params,
    },
    include: { tasks: true },
  });
  return sprints;
}

/**
 * Creates a new sprint.
 *
 * @export
 * @async
 * @param {Sprint} params Information about the sprint to create.
 * @returns {Promise<Sprint>} The created sprint object.
 */
export async function createSprint(params: Partial<Sprint>): Promise<Sprint> {
  const sprint = await prisma.sprint.create({
    data: {
      project: { connect: { id: params.project_id } },
      title: params.title,
      start_date: params.start_date,
      end_date: params.end_date,
      planned_capacity: params.planned_capacity,
    },
  });
  return sprint;
}

/**
 * Updates an existing sprint.
 *
 * @export
 * @async
 * @param {Sprint} params Information about the sprint to update.
 * @returns {Promise<Sprint>} The updated sprint object.
 */
export async function updateSprint(params: Partial<Sprint>): Promise<Sprint> {
  const sprint = await prisma.sprint.update({
    where: { id: params.id },
    data: {
      ...params,
    },
  });
  return sprint;
}

/**
 * Deletes a sprint.
 *
 * @export
 * @async
 * @param {number} id The ID of the sprint to delete.
 * @returns {Promise<Sprint>} The deleted sprint object.
 */
export async function deleteSprint(id: number): Promise<Sprint> {
  const sprint = await prisma.sprint.delete({
    where: {
      id: id,
    },
  });
  return sprint;
}
