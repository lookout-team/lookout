import {
  createActivityLog,
  getActivityLogs,
} from "../db/activity";
import { createProject } from "../db/project";
import { createSprint } from "../db/sprint";
import { createStatus } from "../db/status";
import { createTask } from "../db/task";
import { createUser } from "../db/user";
import { createPriority } from "../db/priority";
import prisma from "../db/prisma";

let userId: number;
let taskId: number;
let statusId: number;
let sprintId: number;
let projectId: number;
let activityIds = [];

beforeAll(async () => {
  const statusData = await createStatus(
    "To Do",
    "On the list of things to-do..."
  );
  statusId = statusData.id;

  const priorityData = await createPriority("High", "Get this shit done now!");

  const projectData = await createProject({
    title: "Project Z",
    description: "This project is classified!",
  });
  projectId = projectData.id;

  const data = await createSprint({
    title: "Test Sprint",
    project_id: projectId,
    start_date: new Date("2024-05-08T08:00:00Z"),
    end_date: new Date("2024-05-09T08:00:00Z"),
    planned_capacity: 1,
  });
  sprintId = data.id;

  const task = await createTask({
    title: "",
    description: "Description",
    requirements: null,
    acceptance_criteria: null,
    points: 5,
    category: "Feature",
    assigned_to: 1,
    sprint_id: sprintId,
    status_id: statusId,
    priority_id: projectId,
  });
  taskId = task.id;

  const user = await createUser({
    username: "TestUser",
    email: "TestUser@gmail.com",
    first_name: "Test",
    last_name: "User",
  });
  userId = user.id;
});

describe("Activity tests", () => {
  test("Create 3 activities", async () => {
    for (let i = 1; i < 4; i++) {
      const activity = {
        description: `Sample activity #${i}`,
        timestamp: new Date("2024-05-08T08:00:00Z"),
        user_id: userId,
        task_id: taskId,
      };
      const data = await createActivityLog(activity);
      expect(data).toMatchObject(activity);
      activityIds.push(data.id);
    }
  });

  test("Retrieve many activities", async () => {
    const data = await getActivityLogs({ task_id: taskId });
    expect(data).toHaveLength(3);
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          description: "Sample activity #1",
          timestamp: new Date("2024-05-08T08:00:00Z"),
          user_id: userId,
          task_id: taskId,
        }),
        expect.objectContaining({
          description: "Sample activity #2",
          timestamp: new Date("2024-05-08T08:00:00Z"),
          user_id: userId,
          task_id: taskId,
        }),
        expect.objectContaining({
          description: "Sample activity #3",
          timestamp: new Date("2024-05-08T08:00:00Z"),
          user_id: userId,
          task_id: taskId,
        }),
      ])
    );
  });
});

afterAll(async () => {
  await prisma.$queryRaw`DELETE FROM Project WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM Sprint WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM Task WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM User WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM Status WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM Priority WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM Activity WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM sqlite_sequence WHERE 1=1`;
  await prisma.$queryRaw`VACUUM`;
});
