import { Prisma } from "@prisma/client";

const TaskWithIncludes = Prisma.validator<Prisma.TaskDefaultArgs>()({
  include: {
    user: true,
    activities: true,
    comments: true,
    status: true,
    sprint: true,
    priority: true,
  },
});

export type TaskWithIncludes = Prisma.TaskGetPayload<typeof TaskWithIncludes>;

const SprintWithIncludes = Prisma.validator<Prisma.SprintDefaultArgs>()({
  include: {
    project: true,
    tasks: true,
  },
});

export type SprintWithIncludes = Prisma.SprintGetPayload<
  typeof SprintWithIncludes
>;
