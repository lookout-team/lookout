import prisma from "./prisma";
import { Project } from "@prisma/client";

/**
 * Creates new project.
 *
 * @param {Project} params - Project details
 * @returns {Promise<Project>} - The created project
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
 * Retrieves project by ID.
 *
 * @param {number} id - Project ID
 * @returns {Promise<Project>} The created project
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
 * Retrieves projects.
 *
 * @param {Partial<Project>} params - Query parameters
 * @returns {Promise<Project[]>} - Array of projects
 */
export async function getProjects(
  params?: Partial<Project>
): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    where: { ...params },
  });
  return projects;
}

/**
 * Updates project.
 *
 * @param {Project} params - Project details
 * @returns {Promise<Project>} - The updated project
 */
export async function updateProject(
  params: Partial<Project>
): Promise<Project> {
  if (typeof params.id === "string") {
    params.id = +params.id;
  }

  const project = await prisma.project.update({
    where: { id: params.id },
    data: {
      ...params,
    },
  });

  return project;
}

/**
 * Deletes project.
 *
 * @param {number} id - Project ID
 * @returns {Promise<Project>} - The deleted project
 */
export async function deleteProject(params: Partial<Project>): Promise<Project> {
  const project = await prisma.project.delete({
    where: {
      id: params.id,
    },
  });
  return project;
}