import {
  createComment,
  getComment,
  getComments,
  updateComment,
  deleteComment,
} from "../db/comment";
import { createProject, deleteProject } from "../db/project";
import { createSprint, deleteSprint } from "../db/sprint";
import { createStatus, deleteStatus } from "../db/status";
import { createTask, deleteTask } from "../db/task";
import { createUser, deleteUser } from "../db/user";
import { createPriority, deletePriority } from "../db/priority";

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

  test("Retrieve single comment", async () => {
    const data = await getComment({ id: commentIds[0] });
    expect(data).toMatchObject({
      text: "Sample comment #1",
      last_modified: new Date("2024-05-08T08:00:00Z"),
      user_id: userId,
      task_id: taskId,
    });
  });

  test("Retrieve many comments", async () => {
    const data = await getComments({ task_id: taskId });
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

  test("Attempt to get nonexistent comment", async () => {
    const data = await getComment({ id: commentIds[2] });
    expect(data).toBe(null);
  });
});

afterAll(async () => {
  await deleteComment(commentIds[1]);
  await deleteComment(commentIds[0]);
  await deleteTask(taskId);
  await deleteSprint(sprintId);
  await deleteProject(projectId);
  await deleteUser(userId);
  await deleteStatus(statusId);
  await deletePriority(priorityId);
});
