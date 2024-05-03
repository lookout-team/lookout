import prisma from "./prisma";
import { Project } from "@prisma/client";

/**
 * Creates a new project.
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
 * Retrieves a project by ID.
 * @param {number} id - Project ID
 * @returns {Promise<Project>} The created project.
 */
export async function getProject(id: number): Promise<Project | null> {
  const project = await prisma.project.findFirst({
    where: {
      id: id,
    },
  });
  return project;
}

/**
 * Deletes a project.
 * @export
 * @async
 * @param {number} id The ID of the project to delete.
 * @returns {Promise<Project>} The deleted project.
 */
export async function deleteProject(id: number): Promise<Project> {
  const project = await prisma.project.delete({
    where: {
      id: id,
    },
  });
  return project;
}
