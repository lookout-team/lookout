import prisma from "./prisma";

/**
 * Creates a new project.
 *
 * @export
 * @async
 * @param {Object} params Information about the project to create.
 * @param {string} params.title The title of the project.
 * @param {string} params.description The description of the project.
 * @param {Date} params.last_updated The last updated date of the project.
 * @param {number} params.current_sprint_id The ID of the current sprint of the project.
 * @returns {Promise<Object>} The created project object.
 */
export async function createProject(params: any) {
  const project = await prisma.project.create({
    data: {
      title: params.title,
      description: params.description,
      last_updated: params.last_updated,
      current_sprint_id: params.current_sprint_id,
    },
  });
  return project;
}

/**
 * Deletes a project.
 *
 * @export
 * @async
 * @param {number} id The ID of the project to delete.
 * @returns {Promise<Object>} The deleted project object.
 */
export async function deleteProject(id: any) {
  const project = await prisma.project.delete({
    where: {
      id: id,
    },
  });
  return project;
}
