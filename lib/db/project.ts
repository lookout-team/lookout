import prisma from "./prisma";
import { Project } from "@prisma/client";

/**
 * Creates a new project.
 *
 * @export
 * @async
 * @param {Project} params Information about the project to create.
 * @returns {Promise<Project>} The created project object.
 */
export async function createProject(
  params: Partial<Project>
): Promise<Project> {
  const project = await prisma.project.create({
    data: {
      ...params,
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
 * @returns {Promise<Project>} The deleted project object.
 */
export async function deleteProject(id: number): Promise<Project> {
  const project = await prisma.project.delete({
    where: {
      id: id,
    },
  });
  return project;
}
