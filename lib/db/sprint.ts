import prisma from "./prisma";

/**
 * Retrieves a single sprint based on provided parameters.
 *
 * @export
 * @async
 * @param {Object} params Information about the sprint.
 * @param {number} params.id The ID of the sprint to retrieve.
 * @param {number} params.project_id The ID of the project the sprint belongs to.
 * @param {string} params.title The title of the sprint.
 * @param {Date} params.start_date The start date of the sprint.
 * @param {Date} params.end_date The end date of the sprint.
 * @returns {Promise<Object>} The retrieved sprint object.
 */
export async function getSprint(params: any): Promise<Object | null> {
  const sprint = await prisma.sprint.findFirst({
    where: {
      id: params.id,
      project_id: params.project_id,
      title: params.title,
      start_date: params.start_date,
      end_date: params.end_date,
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
 * @param {Object} params Information about the sprints to retrieve.
 * @param {number} params.id The ID of the sprint(s) to retrieve.
 * @param {number} params.project_id The ID of the project the sprint(s) belong to.
 * @param {string} params.title The title of the sprint(s).
 * @param {Date} params.start_date The start date of the sprint(s).
 * @param {Date} params.end_date The end date of the sprint(s).
 * @returns {Promise<Object[]>} An array of retrieved sprint objects.
 */
export async function getSprints(params: any): Promise<Object[]> {
  const sprints = await prisma.sprint.findMany({
    where: {
      id: params.id,
      project_id: params.project_id,
      title: params.title,
      start_date: params.start_date,
      end_date: params.end_date,
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
 * @param {Object} params Information about the sprint to create.
 * @param {number} params.project_id The ID of the project the sprint belongs to.
 * @param {string} params.title The title of the sprint.
 * @param {Date} params.start_date The start date of the sprint.
 * @param {Date} params.end_date The end date of the sprint.
 * @param {number} params.planned_capacity The planned capacity of the sprint.
 * @returns {Promise<Object>} The created sprint object.
 */
export async function createSprint(params: any) {
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
 * @param {Object} params Information about the sprint to update.
 * @param {number} params.id The ID of the sprint to update.
 * @param {string} params.title The updated title of the sprint.
 * @param {Date} params.start_date The updated start date of the sprint.
 * @param {Date} params.end_date The updated end date of the sprint.
 * @param {number} params.planned_capacity The updated planned capacity of the sprint.
 * @returns {Promise<Object>} The updated sprint object.
 */
export async function updateSprint(params: any) {
  const sprint = await prisma.sprint.update({
    where: { id: params.id },
    data: {
      title: params.title || undefined,
      start_date: params.start_date || undefined,
      end_date: params.end_date || undefined,
      planned_capacity: params.planned_capacity || undefined,
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
 * @returns {Promise<Object>} The deleted sprint object.
 */
export async function deleteSprint(id: any) {
  const sprint = await prisma.sprint.delete({
    where: {
      id: id,
    },
  });
  return sprint;
}
