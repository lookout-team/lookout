import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../db/user";
import prisma from "../db/prisma";

let userIds: number[] = [];

describe("User tests", () => {
  test("Create 3 users", async () => {
    for (let i = 1; i < 4; i++) {
      const user = {
        username: `Username #${i}`,
        email: `email#${i}@gmail.com`,
        first_name: `First name #${i}`,
        last_name: `Last name #${i}`,
      };
      const data = await createUser(user);
      expect(data).toMatchObject(user);
      userIds.push(data.id);
    }
  });

  test("Retrieve single user", async () => {
    const data = await getUser({
      id: userIds[0],
    });
    expect(data).toMatchObject({
      username: "Username #1",
      email: "email#1@gmail.com",
      first_name: "First name #1",
      last_name: "Last name #1",
    });
  });

  test("Retrieve multiple users", async () => {
    const data = await getUsers({});
    expect(data).toHaveLength(3);
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: "Username #1",
          email: "email#1@gmail.com",
          first_name: "First name #1",
          last_name: "Last name #1",
        }),
        expect.objectContaining({
          username: "Username #2",
          email: "email#2@gmail.com",
          first_name: "First name #2",
          last_name: "Last name #2",
        }),
        expect.objectContaining({
          username: "Username #3",
          email: "email#3@gmail.com",
          first_name: "First name #3",
          last_name: "Last name #3",
        }),
      ])
    );
  });

  test("Update user", async () => {
    const data = await updateUser({
      id: userIds[0],
      first_name: "My name",
      last_name: "...is Jeff",
    });
    expect(data).toMatchObject({
      username: "Username #1",
      email: "email#1@gmail.com",
      first_name: "My name",
      last_name: "...is Jeff",
    });
  });

  test("Delete user", async () => {
    const data = await deleteUser(userIds[0]);
    expect(data).toMatchObject({
      username: "Username #1",
      email: "email#1@gmail.com",
      first_name: "My name",
      last_name: "...is Jeff",
    });
  });

  test("Attempt to retrieve nonexistent user", async () => {
    const data = await getUser({
      id: userIds[0],
    });
    expect(data).toBe(null);
  });
});

afterAll(async () => {
  await deleteUser(userIds[1]);
  await deleteUser(userIds[2]);
  await prisma.$queryRaw`DELETE FROM sqlite_sequence WHERE 1=1`;
});
