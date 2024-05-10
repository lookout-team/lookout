import {
  getChat,
  getChats,
  createChat,
  deleteConversationHistory,
  deleteChat,
  updateChat,
  updateChatStatus,
} from "../db/chat";
import prisma from "../db/prisma";
import { createUser, deleteUser } from "../db/user";

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
      const chat = {
        user_id: userId,
        timestamp: new Date("2024-05-08T08:00:00Z"),
        message: `Sample message #${i}`,
        response: `Sample response #${i}`,
        type: "Write Data",
        data: "{Sample Data: 'Hello World'}",
        status: "In-progress",
      };
      const data = await createChat(chat);
      expect(data).toMatchObject(chat);
      chatIds.push(data.id);
    }
  });

  test("Retrive single chat", async () => {
    const getData = await getChat({ id: chatIds[0] });
    expect(getData).toMatchObject({
      user_id: userId,
      timestamp: new Date("2024-05-08T08:00:00Z"),
      message: "Sample message #1",
      response: "Sample response #1",
      type: "Write Data",
      data: "{Sample Data: 'Hello World'}",
      status: "In-progress",
    });
  });

  test("Retrieve many chats", async () => {
    const getData = await getChats({ user_id: userId });
    expect(getData).toHaveLength(3);
    expect(getData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user_id: userId,
          timestamp: new Date("2024-05-08T08:00:00Z"),
          message: "Sample message #1",
          response: "Sample response #1",
          type: "Write Data",
          data: "{Sample Data: 'Hello World'}",
          status: "In-progress",
        }),
        expect.objectContaining({
          user_id: userId,
          timestamp: new Date("2024-05-08T08:00:00Z"),
          message: "Sample message #2",
          response: "Sample response #2",
          type: "Write Data",
          data: "{Sample Data: 'Hello World'}",
          status: "In-progress",
        }),
        expect.objectContaining({
          user_id: userId,
          timestamp: new Date("2024-05-08T08:00:00Z"),
          message: "Sample message #3",
          response: "Sample response #3",
          type: "Write Data",
          data: "{Sample Data: 'Hello World'}",
          status: "In-progress",
        }),
      ])
    );
  });

  test("Update chat", async () => {
    const data = await updateChat({
      id: chatIds[0],
      response: "New sample response #1",
    });
    expect(data).toMatchObject({
      user_id: userId,
      timestamp: new Date("2024-05-08T08:00:00Z"),
      message: "Sample message #1",
      response: "New sample response #1",
      type: "Write Data",
      data: "{Sample Data: 'Hello World'}",
      status: "In-progress",
    });
  });

  test("Update chat status", async () => {
    const data = await updateChatStatus(chatIds[0], "Completed");
    expect(data).toMatchObject({
      user_id: userId,
      timestamp: new Date("2024-05-08T08:00:00Z"),
      message: "Sample message #1",
      response: "New sample response #1",
      type: "Write Data",
      data: "{Sample Data: 'Hello World'}",
      status: "Completed",
    });
  });

  test("Delete a single chat", async () => {
    const data = await deleteChat(chatIds[2]);
    expect(data).toMatchObject({
      user_id: userId,
      timestamp: new Date("2024-05-08T08:00:00Z"),
      message: "Sample message #3",
      response: "Sample response #3",
      type: "Write Data",
      data: "{Sample Data: 'Hello World'}",
      status: "In-progress",
    });
  });

  test("Delete Conversation History", async () => {
    const data = await deleteConversationHistory(userId);
    expect(data).toMatchObject({ count: 2 });
  });

  test("Attempt to retrieve deleted conversation", async () => {
    const data = await getChat({ id: chatIds[0] });
    expect(data).toEqual(null);
  });
});

afterAll(async () => {
  await deleteUser(userId);
  await prisma.$queryRaw`DELETE FROM sqlite_sequence WHERE 1=1`;
});
