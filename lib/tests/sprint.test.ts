import * as sprint from "../db/sprint";
import * as project from "../db/project";

let createdSprintId: number;
let createdNextSprintId: number;
let createdProjectId: number;

beforeAll(async () => {
  // Call the createSprint function
  try {
    const data = await project.createProject({
      title: "Test Project",
      description: "Root project",
    });
    createdProjectId = data.id;
  } catch (err) {
    console.error(err);
  }
});

describe("Testing sprint file", () => {
  test("Testing Create function", async () => {
    const data = await sprint.createSprint({
      title: "Test Create",
      project_id: createdProjectId,
    });
    createdSprintId = data.id;
    expect(data).toMatchObject({
      title: "Test Create",
      project_id: createdProjectId,
      start_date: null,
      end_date: null,
      planned_capacity: null,
    });
  });

  test("Creating another sprint...", async () => {
    const data = await sprint.createSprint({
      title: "Test Create Number Two",
      project_id: createdProjectId,
    });
    createdNextSprintId = data.id;
    expect(data).toMatchObject({
      title: "Test Create Number Two",
      project_id: createdProjectId,
      start_date: null,
      end_date: null,
      planned_capacity: null,
    });
  });

  test("Testing Get function", async () => {
    const data = await sprint.getSprint({
      id: createdSprintId,
    });
    expect(data).toMatchObject({
      id: createdSprintId,
      title: "Test Create",
      project_id: createdProjectId,
      start_date: null,
      end_date: null,
      planned_capacity: null,
    });
  });

  test("Testing Get Many Sprints function", async () => {
    const data = await sprint.getSprints({
      project_id: createdProjectId,
    });
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdSprintId,
          title: "Test Create",
          project_id: createdProjectId,
          start_date: null,
          end_date: null,
          planned_capacity: null,
        }),
        expect.objectContaining({
          id: createdNextSprintId,
          title: "Test Create Number Two",
          project_id: createdProjectId,
          start_date: null,
          end_date: null,
          planned_capacity: null,
        }),
      ])
    );
  });

  test("Testing Update function", async () => {
    const data = await sprint.updateSprint({
      id: createdSprintId,
      planned_capacity: 5,
    });
    expect(data).toMatchObject({
      id: createdSprintId,
      title: "Test Create",
      project_id: createdProjectId,
      start_date: null,
      end_date: null,
      planned_capacity: 5,
    });
  });

  test("Testing Delete function", async () => {
    const data = await sprint.deleteSprint(createdSprintId);
    expect(data).toMatchObject({
      id: createdSprintId,
      title: "Test Create",
      project_id: createdProjectId,
      start_date: null,
      end_date: null,
      planned_capacity: 5,
    });
  });

  test("Testing Get deleted Sprint function", async () => {
    const data = await sprint.getSprint({
      id: createdSprintId,
    });
    expect(data).toBe(null);
  });
});

afterAll(async () => {
  // Delete sprint record
  await sprint.deleteSprint(createdNextSprintId);

  // Delete project record
  await project.deleteProject(createdProjectId);
});
