import {
  createComment,
  getTaskComments,
  updateComment,
  deleteComment,
} from "../db/comment";
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
let priorityId: number;
let commentIds: number[] = [];

beforeAll(async () => {
  const statusData = await createStatus(
    "To Do",
    "On the list of things to-do..."
  );
  statusId = statusData.id;

  const priorityData = await createPriority("High", "Get this shit done now!");
  priorityId = priorityData.id;

  const projectData = await createProject({
    title: "Project Z",
    description: "This project is classified!",
    last_updated: null,
    current_sprint_id: null
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

  const user = await createUser({
    username: "TestUser",
    email: "TestUser@gmail.com",
    password: "Test",
    first_name: "Test",
    last_name: "User",
    salt: "Mortons",
  });
  userId = user.id;

  const task = await createTask({
    title: "Title",
    description: "Description",
    requirements: null,
    acceptance_criteria: null,
    points: 5,
    category: "Feature",
    assigned_to: userId,
    sprint_id: sprintId,
    status_id: statusId,
    priority_id: priorityId,
  });
  taskId = task.id;
});

describe("Comment tests", () => {
  test("Create 3 comments", async () => {
    for (let i = 1; i < 4; i++) {
      const comment = {
        text: `Sample comment #${i}`,
        last_modified: new Date("2024-05-08T08:00:00Z"),
        user_id: userId,
        task_id: taskId,
      };
      const data = await createComment(comment);
      expect(data).toMatchObject(comment);
      commentIds.push(data.id);
    }
  });

  test("Retrieve many comments", async () => {
    const data = await getTaskComments(taskId);
    expect(data).toHaveLength(3);
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: "Sample comment #1",
          last_modified: new Date("2024-05-08T08:00:00Z"),
          user_id: userId,
          task_id: taskId,
        }),
        expect.objectContaining({
          text: "Sample comment #2",
          last_modified: new Date("2024-05-08T08:00:00Z"),
          user_id: userId,
          task_id: taskId,
        }),
        expect.objectContaining({
          text: "Sample comment #3",
          last_modified: new Date("2024-05-08T08:00:00Z"),
          user_id: userId,
          task_id: taskId,
        }),
      ])
    );
  });

  test("Update comment", async () => {
    const data = await updateComment({
      id: commentIds[2],
      text: "mmm, whatcha say?",
      last_modified: new Date("2024-05-09T08:00:00Z"),
    });
    expect(data).toMatchObject({
      text: "mmm, whatcha say?",
      last_modified: new Date("2024-05-09T08:00:00Z"),
      user_id: userId,
      task_id: taskId,
    });
  });

  test("Delete comment", async () => {
    const data = await deleteComment(commentIds[2]);
    expect(data).toMatchObject({
      text: "mmm, whatcha say?",
      last_modified: new Date("2024-05-09T08:00:00Z"),
      user_id: userId,
      task_id: taskId,
    });
  });
});

afterAll(async () => {
  await prisma.$queryRaw`DELETE FROM Project WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM Sprint WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM Task WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM User WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM Comment WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM 'Status' WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM 'Priority' WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM Activity WHERE 1=1`;
  await prisma.$queryRaw`DELETE FROM sqlite_sequence WHERE 1=1`;
  await prisma.$queryRaw`VACUUM`;
});
