import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "../db/project";
import { ProjectParams } from "./params";

export function initializeTools() {
  let tools = [];

  const projectFunctions = [
    {
      type: "function",
      function: {
        name: "createProject",
        description: "Create new project",
        parameters: {
          ...ProjectParams,
          required: ["title", "description"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getProject",
        description: "Retrieve one project",
        parameters: {
          ...ProjectParams,
          required: ["id"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getProjects",
        description: "Retrive many projects",
        parameters: ProjectParams,
      },
    },
    {
      type: "function",
      function: {
        name: "updateProject",
        description: "Update project details",
        parameters: ProjectParams,
      },
    },
    {
      type: "function",
      function: {
        name: "deleteProject",
        description: "Update project details",
        parameters: {
          id: {
            type: "number",
            description: "Project ID",
          },
          required: ["id"],
        },
      },
    },
  ];

  tools = [...projectFunctions];

  return tools;
}

export function readFunctions() {
  const functionMap: Record<string, (...args: any) => unknown> = {
    getProject: getProject,
    getProjects: getProjects,
  };
  return functionMap;
}

export function writeFunctions() {
  const functionMap: Record<string, (...args: any) => unknown> = {
    createProject: createProject,
    updateProject: updateProject,
    deleteProject: deleteProject,
  };
  return functionMap;
}
