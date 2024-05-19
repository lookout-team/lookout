import { createSprint } from "../db/sprint";
import { createProject } from "../db/project";
import {
  createTask,
  getTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../db/task";
import { createPriority } from "../db/priority";
import { createStatus } from "../db/status";
import prisma from "../db/prisma";
import { createUser } from "../db/user";

let projectId: number;
let userId: number;
let priorityId: number;
let statusId: number;
let sprintIds: number[] = [];
let taskIds: number[] = [];
let deletedTaskId: number;

const startDate = new Date("2024-05-01T08:00:00Z");
const endDate = new Date("2024-05-07T17:00:00Z");

beforeAll(async () => {
  const user = await createUser({
    username: "John Doe",
    email: "johndoe@gmail.com",
    first_name: "John",
    last_name: "Doe",
  });
  userId = user.id;

  const projectData = await createProject({
    title: "Project Z",
    description: "This project is classified!",
    last_updated: null,
    current_sprint_id: null
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
        title: item!,
        description: "Description",
        requirements: null,
        acceptance_criteria: null,
        points: 5,
        category: "Feature",
        assigned_to: 1,
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
      title: "Set up database and ORM",
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
      description: "Description",
      requirements: null,
      acceptance_criteria: null,
      points: 5,
      category: "Feature",
      assigned_to: userId,
      sprint_id: sprintIds[0],
      status_id: statusId,
      priority_id: priorityId,
    };
    const newTask = await createTask(taskDetails);
    const data = await deleteTask(newTask.id);
    expect(data).toMatchObject(taskDetails);
    deletedTaskId = newTask.id;
  });

  test("Attempt to retrieve deleted task", async () => {
    const data = await getTask({ id: deletedTaskId });
    expect(data).toBe(null);
  });
});

afterAll(async () => {
  await prisma.$queryRaw`DELETE FROM Project WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM Sprint WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM Task WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM 'Status' WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM 'Priority' WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM 'Priority' WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM sqlite_sequence WHERE 1=1`;
  await prisma.$queryRaw`VACUUM`;
});
