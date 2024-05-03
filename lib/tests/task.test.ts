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
let taskId: number;
let priorityId: number;
let statusId: number;

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
        sprint_id: 1,
        status_id: statusId,
        priority_id: priorityId,
      };
      const data = await createTask(task);
      expect(data).toMatchObject(task);
    }
  });

  test("Retrieve a single task", async () => {
    const data = await getTask({ id: 1 });
    expect(data).toMatchObject({
      title: "Design UX wireframe for Project Z",
      sprint_id: 1,
      status_id: statusId,
      priority_id: priorityId,
    });
  });

  test("Retrieve multiple tasks", async () => {
    const data = await getTasks({
      sprint_id: 1,
    });
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Design UX wireframe for Project Z",
          sprint_id: 1,
          status_id: statusId,
          priority_id: priorityId,
        }),
        expect.objectContaining({
          title: "Set up database and ORM",
          sprint_id: 1,
          status_id: statusId,
          priority_id: priorityId,
        }),
        expect.objectContaining({
          title: "Obtain OpenAI API keys",
          sprint_id: 1,
          status_id: statusId,
          priority_id: priorityId,
        }),
        expect.objectContaining({
          title: "AuthError defect with login page",
          sprint_id: 1,
          status_id: statusId,
          priority_id: priorityId,
        }),
      ])
    );
  });

  test("Update task", async () => {
    const data = await updateTask({
      id: 4,
      description: "Sample task description",
      category: "Feature",
      requirements: "minimal",
      acceptance_criteria: "must dance",
      points: 5,
      sprint_id: 2,
    });
    expect(data).toMatchObject({
      id: 4,
      title: "AuthError defect with login page",
      description: "Sample task description",
      category: "Feature",
      requirements: "minimal",
      acceptance_criteria: "must dance",
      points: 5,
      sprint_id: 2,
      status_id: statusId,
      priority_id: priorityId,
    });
  });

  test("Delete task", async () => {
    const taskDetails = {
      title: "DELETE ME!",
      sprint_id: 3,
      status_id: statusId,
      priority_id: priorityId,
    };
    const newTask = await createTask(taskDetails);
    const data = await deleteTask(newTask.id);
    expect(data).toMatchObject(taskDetails);
  });

  test("Attempt to retrieve deleted task", async () => {
    const data = await getTask({ id: 5 });
    expect(data).toBe(null);
  });
});

afterAll(async () => {
  for (let i = 1; i < 5; i++) {
    await deleteTask(i);
  }
  for (let i = 1; i < 4; i++) {
    await deleteSprint(i);
  }
  await deleteProject(1);
  await deletePriority(1);
  await deleteStatus(1);
  await prisma.$queryRaw`DELETE FROM sqlite_sequence WHERE 1=1`
});
