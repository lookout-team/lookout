import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type Task = Prisma.TaskGetPayload<{
  include: {
    user: true;
    status: true;
    priority: true;
  };
}>;

export type Sprint = Prisma.SprintGetPayload<{
  include: {
    tasks: true;
  };
}>;
