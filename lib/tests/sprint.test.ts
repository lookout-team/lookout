import {
  createSprint,
  getSprint,
  getSprints,
  updateSprint,
  deleteSprint,
} from "../db/sprint";
import { createProject, deleteProject } from "../db/project";
import prisma from "../db/prisma";

let projectId: number;
const startDate = new Date("2024-05-01T08:00:00Z");
const endDate = new Date("2024-05-07T17:00:00Z");

beforeAll(async () => {
  const data = await createProject({
    title: "Project X",
    description: "Likely the greatest project humanity has ever seen",
    last_updated: new Date("2024-05-01T10:00:00Z"),
  });
  projectId = data.id;
});

describe("Sprint Tests", () => {
  test("Create 3 sprints", async () => {
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
  });

  test("Retrieve single sprint", async () => {
    const data = await getSprint({
      id: 1,
    });
    expect(data).toMatchObject({
      id: 1,
      title: "Sprint 1",
      project_id: projectId,
      start_date: startDate,
      end_date: endDate,
      planned_capacity: 41,
    });
  });

  test("Retrieve multiple sprints", async () => {
    const data = await getSprints({
      project_id: projectId,
    });
    expect(data).toHaveLength(3);
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Sprint 1",
          project_id: projectId,
          start_date: startDate,
          end_date: endDate,
          planned_capacity: 41,
        }),
        expect.objectContaining({
          title: "Sprint 2",
          project_id: projectId,
          start_date: startDate,
          end_date: endDate,
          planned_capacity: 42,
        }),
        expect.objectContaining({
          title: "Sprint 3",
          project_id: projectId,
          start_date: startDate,
          end_date: endDate,
          planned_capacity: 43,
        }),
      ])
    );
  });

  test("Update sprint details", async () => {
    const data = await updateSprint({
      id: 1,
      end_date: null,
      planned_capacity: 30,
    });
    expect(data).toMatchObject({
      id: 1,
      title: "Sprint 1",
      project_id: projectId,
      start_date: startDate,
      end_date: null,
      planned_capacity: 30,
    });
  });

  test("Delete sprint", async () => {
    const data = await deleteSprint(3);
    expect(data).toMatchObject({
      id: 3,
      title: "Sprint 3",
      project_id: projectId,
      start_date: startDate,
      end_date: endDate,
      planned_capacity: 43,
    });
  });

  test("Attempt to retrieve nonexist sprint", async () => {
    const data = await getSprint({
      id: 3,
    });
    expect(data).toBe(null);
  });
});

afterAll(async () => {
  await deleteSprint(1);
  await deleteSprint(2);
  await deleteProject(1);
  await prisma.$queryRaw`DELETE FROM sqlite_sequence WHERE 1=1`
});
