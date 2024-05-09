import {
  createActivity,
  getActivity,
  getActivities,
  updateActivity,
  deleteActivity,
} from "../db/activity";
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

describe("Activity tests", () => {
  test("Create 3 activities", async () => {
    for (let i = 1; i < 4; i++) {
      const activity = {
        description: `Sample activity #${i}`,
        timestamp: new Date("2024-05-08T08:00:00Z"),
        user_id: userId,
        task_id: taskId,
      };
      const data = await createActivity(activity);
      expect(data).toMatchObject(activity);
    }
  });

  test("Retrieve single activity", async () => {
    const data = await getActivity({ id: 1 });
    expect(data).toMatchObject({
      description: "Sample activity #1",
      timestamp: new Date("2024-05-08T08:00:00Z"),
      user_id: userId,
      task_id: taskId,
    });
  });

  test("Retrieve many activities", async () => {
    const data = await getActivities({ task_id: taskId });
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

  test("Update activity", async () => {
    const data = await updateActivity({
      id: 1,
      description: "Get plenty of sleep",
    });
    expect(data).toMatchObject({
      description: "Get plenty of sleep",
      timestamp: new Date("2024-05-08T08:00:00Z"),
      user_id: userId,
      task_id: taskId,
    });
  });

  test("Delete activity", async () => {
    const data = await deleteActivity(3);
    expect(data).toMatchObject({
      description: "Sample activity #3",
      timestamp: new Date("2024-05-08T08:00:00Z"),
      user_id: userId,
      task_id: taskId,
    });
  });

  test("Attempt to get nonexistent activity", async () => {
    const data = await getActivity({ id: 3 });
    expect(data).toBe(null);
  });
});

afterAll(async () => {
  await deleteActivity(1);
  await deleteActivity(2);
  await deleteTask(taskId);
  await deleteSprint(sprintId);
  await deleteProject(projectId);
  await deleteUser(userId);
  await deleteStatus(statusId);
  await deletePriority(priorityId);
});
