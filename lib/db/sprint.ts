import prisma from "./prisma";
import { Sprint } from "@prisma/client";
import { SprintWithIncludes } from "./types";
import { createActivityLog } from "./activity";

/**
 * Retrieves a single sprint based on provided parameters.
 *
 * @param {Sprint} params - Sprint details
 * @returns {Promise<SprintWithIncludes | null>} - Sprint, if found
 */
export async function getSprint(
  params: Partial<Sprint>
): Promise<SprintWithIncludes | null> {
  const sprint = await prisma.sprint.findFirst({
    where: {
      ...params,
    },
    include: { tasks: true, project: true },
  });
  return sprint;
}

/**
 * Retrieves multiple sprints based on provided parameters.
 *
 * @param {Sprint} params - Sprint details
 * @returns {Promise<SprintWithIncludes[]>} - Sprint array
 */
export async function getSprints(
  params?: Partial<Sprint>
): Promise<SprintWithIncludes[]> {
  const sprints = await prisma.sprint.findMany({
    where: {
      ...params,
    },
    include: { tasks: true, project: true },
  });
  return sprints;
}

/**
 * Creates new sprint.
 *
 * @param {Sprint} params - Sprint details
 * @returns {Promise<Sprint>} - The created sprint
 */
export async function createSprint(
  params: Omit<Sprint, "id">
): Promise<Sprint> {
  const sprint = await prisma.sprint.create({
    data: {
      ...params,
    },
  });
  createActivityLog("Create", "sprint", sprint.id);
  return sprint;
}

/**
 * Updates given sprint.
 *
 * @param {Sprint} params - Sprint details
 * @returns {Promise<Sprint>} - The updated sprint
 */
export async function updateSprint(params: Partial<Sprint>): Promise<Sprint> {
  if (typeof params.id === "string") {
    params.id = +params.id;
  }

  const sprint = await prisma.sprint.update({
    where: { id: params.id },
    data: {
      ...params,
    },
  });
  createActivityLog("Update", "sprint", sprint.id);
  return sprint;
}

/**
 * Deletes sprint.
 *
 * @param {number} id - Sprint ID
 * @returns {Promise<Sprint>} - The deleted sprint
 */
export async function deleteSprint(id: number): Promise<Sprint> {
  const sprint = await prisma.sprint.delete({
    where: {
      id: id,
    },
  });
  createActivityLog("Delete", "sprint", id);
  return sprint;
}
