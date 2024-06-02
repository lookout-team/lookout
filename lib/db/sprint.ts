import prisma from "./prisma";
import { Prisma, Sprint } from "@prisma/client";
import { SprintWithIncludes } from "./types";
import { createActivityLog } from "./activity";
import { getProject } from "./project";

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
    where: params,
    include: { tasks: true, project: true },
  });
  return sprints;
}

/**
 * Retrieves a single sprint based on provided parameters.
 *
 * @param {Sprint} params - Sprint details
 * @returns {Promise<Sprint | null>} - Sprint, if found
 */
export async function getSprintWithoutInclusions(
  params: Partial<Sprint>
): Promise<Sprint | null> {
  return await prisma.sprint.findFirst({
    where: params,
  });
}

/**
 * Retrieves multiple sprints based on provided parameters.
 *
 * @param {Sprint} params - Sprint details
 * @returns {Promise<Sprint[]>} - Sprint array
 */
export async function getSprintsWithoutInclusions(
  params?: Partial<Sprint>
): Promise<Sprint[]> {
  return await prisma.sprint.findMany({
    where: params,
  });
}

/**
 * Creates new sprint.
 *
 * @param {Sprint} params - Sprint details
 * @param {string} project_title - Project title (optional)
 * @returns {Promise<Sprint>} - The created sprint
 */
export async function createSprint(
  params: Omit<Sprint, "id">,
  project_title?: string
): Promise<Sprint> {
  // OpenAI's assistant can't call functions sequentially in one run
  // So we make the additional queries ourselves
  if (project_title) {
    const project = await getProject({ title: project_title });
    if (project != null) params.project_id = project?.id;
  }

  const sprint = await prisma.sprint.create({
    data: {
      ...params,
    },
  });

  await createActivityLog("Create", "sprint", sprint.id, params);
  return sprint;
}

/**
 * Updates given sprint.
 *
 * @param {Sprint} params - Sprint details
 * @param {string} projectTitle - Project name (optional)
 * @returns {Promise<Sprint>} - The updated sprint
 */
export async function updateSprint(
  params: Partial<Sprint>,
  projectTitle?: string
): Promise<Sprint> {
  if (typeof params.id === "string") {
    params.id = +params.id;
  }

  let where: Prisma.SprintWhereUniqueInput = { id: params.id };

  if (projectTitle != null) {
    const project = await getProject({ title: projectTitle });
    where = { ...where, project_id: project?.id };
  }

  const sprint = await prisma.sprint.update({
    where: where,
    data: {
      ...params,
    },
  });

  await createActivityLog("Update", "sprint", sprint.id, params);
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
  return sprint;
}
