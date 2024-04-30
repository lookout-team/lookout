import * as sprint from "../db/sprint";
import * as project from "../db/project";
import * as task from "../db/task";
import * as priority from "../db/priority";
import * as status from "../db/status";

let createdTaskId: number;
let createdNextTaskId: number;
let createdProjectId: number;
let createdSprintId: number;
let createdPriorityId: number;
let createdStatusId: number;

beforeAll(async () => {
  // Call the createProject function
  const projectData = await project.createProject({
    title: "Test Project",
    description: "Root project",
  });
  createdProjectId = projectData.id;

  const sprintData = await sprint.createSprint({
    title: "Test Create",
    project_id: createdProjectId,
  });
  createdSprintId = sprintData.id;

  const priorityData = await priority.createPriority(
    "High Priority",
    "Get this shit done now!"
  );
  createdPriorityId = priorityData.id;

  const statusData = await status.createStatus(
    "To-Do",
    "On the list of things to-do..."
  );
  createdStatusId = statusData.id;
});

describe("Testing task file", () => {
  test("Testing Create function", async () => {
    const data = await task.createTask({
      title: "Test Create",
      sprint_id: createdSprintId,
      status_id: createdStatusId,
      priority_id: createdPriorityId,
    });
    createdTaskId = data.id;
    expect(data).toMatchObject({
      title: "Test Create",
      description: null,
      category: null,
      requirements: null,
      acceptance_criteria: null,
      points: null,
      assigned_to: null,
      sprint_id: createdSprintId,
      status_id: createdStatusId,
      priority_id: createdPriorityId,
    });
  });

  test("Creating another task...", async () => {
    const data = await task.createTask({
      title: "Test Create Number Two",
      sprint_id: createdSprintId,
      status_id: createdStatusId,
      priority_id: createdPriorityId,
    });
    createdNextTaskId = data.id;
    expect(data).toMatchObject({
      title: "Test Create Number Two",
      description: null,
      category: null,
      requirements: null,
      acceptance_criteria: null,
      points: null,
      assigned_to: null,
      sprint_id: createdSprintId,
      status_id: createdStatusId,
      priority_id: createdPriorityId,
    });
  });

  test("Testing Get function", async () => {
    const data = await task.getTask({
      id: createdTaskId,
    });
    expect(data).toMatchObject({
      title: "Test Create",
      description: null,
      category: null,
      requirements: null,
      acceptance_criteria: null,
      points: null,
      assigned_to: null,
      sprint_id: createdSprintId,
      status_id: createdStatusId,
      priority_id: createdPriorityId,
    });
  });

  test("Testing Get Many Tasks function", async () => {
    const data = await task.getTasks({
      sprint_id: createdSprintId,
    });
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdTaskId,
          title: "Test Create",
          description: null,
          category: null,
          requirements: null,
          acceptance_criteria: null,
          points: null,
          assigned_to: null,
          sprint_id: createdSprintId,
          status_id: createdStatusId,
          priority_id: createdPriorityId,
        }),
        expect.objectContaining({
          id: createdNextTaskId,
          title: "Test Create Number Two",
          description: null,
          category: null,
          requirements: null,
          acceptance_criteria: null,
          points: null,
          assigned_to: null,
          sprint_id: createdSprintId,
          status_id: createdStatusId,
          priority_id: createdPriorityId,
        }),
      ])
    );
  });

  test("Testing Update function", async () => {
    const data = await task.updateTask({
      id: createdTaskId,
      description: "Yeehaw",
      category: "Catboy",
      requirements: "minimal",
      acceptance_criteria: "must dance",
      points: 5,
    });
    expect(data).toMatchObject({
      id: createdTaskId,
      title: "Test Create",
      description: "Yeehaw",
      category: "Catboy",
      requirements: "minimal",
      acceptance_criteria: "must dance",
      points: 5,
      assigned_to: null,
      sprint_id: createdSprintId,
      status_id: createdStatusId,
      priority_id: createdPriorityId,
    });
  });

  test("Testing Delete function", async () => {
    const data = await task.deleteTask(createdTaskId);
    expect(data).toMatchObject({
      id: createdTaskId,
      title: "Test Create",
      description: "Yeehaw",
      category: "Catboy",
      requirements: "minimal",
      acceptance_criteria: "must dance",
      points: 5,
      assigned_to: null,
      sprint_id: createdSprintId,
      status_id: createdStatusId,
      priority_id: createdPriorityId,
    });
  });

  test("Testing Get deleted Task function", async () => {
    const data = await task.getTask({
      id: createdTaskId,
    });
    expect(data).toBe(null);
  });
});

afterAll(async () => {
  // Delete task records
  await task.deleteTask(createdNextTaskId);

  // Delete sprint record
  await sprint.deleteSprint(createdSprintId);

  // Delete project record
  await project.deleteProject(createdProjectId);

  // Delete priority record
  await priority.deletePriority(createdPriorityId);

  // Delete status record
  await status.deleteStatus(createdStatusId);
});
