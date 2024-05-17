import { createProject, getProject, getProjects } from "../db/project";
import { ProjectParams } from "./params";

export function initializeTools() {
  let tools = [];

  const projectFunctions = [
    {
      type: "function",
      function: {
        name: "createProject",
        description: "Create a new project",
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
        description: "Retrieve a specific project based on query parameters",
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
        description: "Retrieve an array of projects based on query parameters",
        parameters: ProjectParams,
      },
    }
  ]

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
  };
  return functionMap;
}
