import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "../db/project";
import {
  createSprint,
  deleteSprint,
  getSprintWithoutInclusions,
  getSprintsWithoutInclusions,
  updateSprint,
} from "../db/sprint";
import {
  createTask,
  deleteTask,
  getTaskWithoutInclusions,
  getTasksWithoutInclusions,
  updateTask,
} from "../db/task";
import { ProjectParams, SprintParams, TaskParams } from "./params";

const projectRequired = ["title", "description"];
const sprintRequired = [
  "title",
  "start_date",
  "end_date",
  "planned_capacity",
  "project_title",
];
const taskRequired = [
  "title",
  "description",
  "category",
  "points",
  "project_title",
  "sprint_title",
];

export function initializeTools() {
  let tools = [];

  const projectTools = defineModelTools(
    "Project",
    ProjectParams,
    projectRequired
  );
  const sprintTools = defineModelTools("Sprint", SprintParams, sprintRequired);
  const taskTools = defineModelTools("Task", TaskParams, taskRequired);

  tools = [...projectTools, ...sprintTools, ...taskTools];
  return tools;
}

function defineModelTools(
  model: string,
  params: any,
  requiredParams: string[]
): any[] {
  return [
    {
      type: "function",
      function: {
        name: `create${model}`,
        description: `Create new ${model}`,
        parameters: {
          ...params,
          required: requiredParams,
        },
      },
    },
    {
      type: "function",
      function: {
        name: `get${model}`,
        description: `Retrieve one ${model}`,
        parameters: {
          ...params,
          required: ["title"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: `get${model}s`,
        description: `Retrieve many ${model}s`,
        parameters: params,
      },
    },
    {
      type: "function",
      function: {
        name: `update${model}`,
        description: `Update ${model} details`,
        parameters: params,
      },
    },
    {
      type: "function",
      function: {
        name: `delete${model}`,
        description: `Delete ${model}`,
        parameters: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: `${model} id`,
            },
          },
          required: ["id"],
        },
      },
    },
  ];
}

export function readFunctions() {
  const functionMap: Record<string, (...args: any) => unknown> = {
    getProject: getProject,
    getProjects: getProjects,
    getSprint: getSprintWithoutInclusions,
    getSprints: getSprintsWithoutInclusions,
    getTask: getTaskWithoutInclusions,
    getTasks: getTasksWithoutInclusions,
  };
  return functionMap;
}

export function writeFunctions() {
  const functionMap: Record<string, (...args: any) => unknown> = {
    createProject: createProject,
    updateProject: updateProject,
    deleteProject: deleteProject,
    createSprint: createSprint,
    updateSprint: updateSprint,
    deleteSprint: deleteSprint,
    createTask: createTask,
    updateTask: updateTask,
    deleteTask: deleteTask,
  };
  return functionMap;
}
