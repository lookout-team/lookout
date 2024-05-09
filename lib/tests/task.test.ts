import { createSprint, deleteSprint } from "../db/sprint";
import { createProject, deleteProject } from "../db/project";
import {
  createTask,
  getTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../db/task";
import { createPriority, deletePriority } from "../db/priority";
import { createStatus, deleteStatus } from "../db/status";
import prisma from "../db/prisma";

let projectId: number;
let priorityId: number;
let statusId: number;
let sprintIds: number[] = [];
let taskIds: number[] = [];

const startDate = new Date("2024-05-01T08:00:00Z");
const endDate = new Date("2024-05-07T17:00:00Z");

beforeAll(async () => {
  const projectData = await createProject({
    title: "Project Z",
    description: "This project is classified!",
  });
  projectId = projectData.id;

  for (let i = 1; i < 4; i++) {
    const sprint = {
      title: `Sprint ${i}`,
      project_id: projectId,
      start_date: startDate,
      end_date: endDate,
      planned_capacity: i + 40,
    };
    const data = await createSprint(sprint);
    expect(data).toMatchObject(sprint);
    sprintIds.push(data.id);
  }

  const priorityData = await createPriority("High", "Get this shit done now!");
  priorityId = priorityData.id;

  const statusData = await createStatus(
    "To Do",
    "On the list of things to-do..."
  );
  statusId = statusData.id;
});

describe("Task tests", () => {
  test("Create tasks", async () => {
    const items = [
      "Design UX wireframe for Project Z",
      "Set up database and ORM",
      "Obtain OpenAI API keys",
      "AuthError defect with login page",
    ];

    for (const item of items) {
      const task = {
        title: item,
        sprint_id: sprintIds[0],
        status_id: statusId,
        priority_id: priorityId,
      };
      const data = await createTask(task);
      expect(data).toMatchObject(task);
      taskIds.push(data.id);
    }
  });

  test("Retrieve a single task", async () => {
    const data = await getTask({ id: taskIds[0] });
    expect(data).toMatchObject({
      title: "Design UX wireframe for Project Z",
      sprint_id: sprintIds[0],
      status_id: statusId,
      priority_id: priorityId,
    });
  });

  test("Retrieve multiple tasks", async () => {
    const data = await getTasks({
      sprint_id: sprintIds[0],
    });
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Design UX wireframe for Project Z",
          sprint_id: sprintIds[0],
          status_id: statusId,
          priority_id: priorityId,
        }),
        expect.objectContaining({
          title: "Set up database and ORM",
          sprint_id: sprintIds[0],
          status_id: statusId,
          priority_id: priorityId,
        }),
        expect.objectContaining({
          title: "Obtain OpenAI API keys",
          sprint_id: sprintIds[0],
          status_id: statusId,
          priority_id: priorityId,
        }),
        expect.objectContaining({
          title: "AuthError defect with login page",
          sprint_id: sprintIds[0],
          status_id: statusId,
          priority_id: priorityId,
        }),
      ])
    );
  });

  test("Update task", async () => {
    const data = await updateTask({
      id: taskIds[1],
      description: "Sample task description",
      category: "Feature",
      requirements: "minimal",
      acceptance_criteria: "must dance",
      points: 5,
      sprint_id: sprintIds[1],
    });
    expect(data).toMatchObject({
      id: taskIds[1],
      title: "AuthError defect with login page",
      description: "Sample task description",
      category: "Feature",
      requirements: "minimal",
      acceptance_criteria: "must dance",
      points: 5,
      sprint_id: sprintIds[1],
      status_id: statusId,
      priority_id: priorityId,
    });
  });

  test("Delete task", async () => {
    const taskDetails = {
      title: "DELETE ME!",
      sprint_id: sprintIds[2],
      status_id: statusId,
      priority_id: priorityId,
    };
    const newTask = await createTask(taskDetails);
    const data = await deleteTask(newTask.id);
    expect(data).toMatchObject(taskDetails);
    taskIds.push(newTask.id);
  });

  test("Attempt to retrieve deleted task", async () => {
    const data = await getTask({ id: taskIds[4] });
    expect(data).toBe(null);
  });
});

afterAll(async () => {
  for (let task in taskIds) {
    await deleteTask(parseInt(task));
  }
  for (let sprint in sprintIds) {
    await deleteSprint(parseInt(sprint));
  }
  await deleteProject(1);
  await deletePriority(1);
  await deleteStatus(1);
  await prisma.$queryRaw`DELETE FROM sqlite_sequence WHERE 1=1`;
});
