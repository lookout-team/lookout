import {
  getConversationHistory,
  saveExchange,
  deleteConversationHistory,
} from "../db/chat";
import prisma from "../db/prisma";
import { createUser } from "../db/user";

let userId: number;
let chatIds: number[] = [];

beforeAll(async () => {
  const user = await createUser({
    username: "TestUser",
    email: "TestUser@gmail.com",
    first_name: "Test",
    last_name: "User",
  });
  userId = user.id;
});

describe("Testing chat functions", () => {
  test("Creating 3 chats", async () => {
    for (let i = 1; i < 4; i++) {
      const message = `Sample message #${i}`;
      const status: "pending" | "confirmed" | "canceled" = "pending";
      const responseData = { id: "1", title: "Title" };

      const response = {
        message: `Sample response #${i}`,
        data: responseData,
        componentType: null,
        status: status
      }

      const expected = {
        user_id: userId,
        timestamp: new Date(),
        message: message,
        response: response.message,
        type: "write",
        data: JSON.stringify(responseData),
        status: response.status,
      }

      const data = await saveExchange(userId, message, response, "write");
      expect(data).toMatchObject(expected);
      chatIds.push(data.id);
    }
  });

  test("Retrieve conversation history", async () => {
      const responseData = { id: "1", title: "Title" };
      const getData = await getConversationHistory(userId);

    expect(getData).toHaveLength(3);
    expect(getData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user_id: userId,
          message: "Sample message #1",
          response: "Sample response #1",
          type: "write",
          data: JSON.stringify(responseData),
          status: "pending",
        }),
        expect.objectContaining({
          user_id: userId,
          message: "Sample message #2",
          response: "Sample response #2",
          type: "write",
          data: JSON.stringify(responseData),
          status: "pending",
        }),
        expect.objectContaining({
          user_id: userId,
          message: "Sample message #3",
          response: "Sample response #3",
          type: "write",
          data: JSON.stringify(responseData),
          status: "pending",
        }),
      ])
    );
  });

  test("Delete conversation history", async () => {
    const data = await deleteConversationHistory(userId);
    expect(data).toMatchObject({ count: 2 });
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
