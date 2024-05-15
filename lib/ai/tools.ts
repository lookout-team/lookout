import { createProject, getProject } from "../db/project";
import { ProjectParams } from "./params";

export function initializeTools() {
  const tools = [];

  tools.push({
    type: "function",
    function: {
      name: "createProject",
      description: "Create a new project",
      parameters: {
        ...ProjectParams,
        required: ["title", "description"],
      },
    },
  });

  tools.push({
    type: "function",
    function: {
      name: "getProjects",
      description: "Retrieve a specific project based on given parameters",
      parameters: ProjectParams,
    },
  });

  return tools;
}

export function mapFunctions() {
  const functionMap: Record<string, (...args: any) => unknown> = {
    getProject: getProject,
    createProject: createProject,
  };
  return functionMap;
}
