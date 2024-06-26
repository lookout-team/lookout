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

const UserWithIncludes = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    task: true,
    activities: true,
    role: true,
    projects: true,
    comments: true,
    chats: true,
  },
});

export type UserWithIncludes = Prisma.UserGetPayload<typeof UserWithIncludes>;

const ActivityWithIncludes = Prisma.validator<Prisma.ActivityDefaultArgs>()({
  include: {
    user: true,
    task: true,
  },
});

export type ActivityWithIncludes = Prisma.ActivityGetPayload<
  typeof ActivityWithIncludes
>;

const CommentWithIncludes = Prisma.validator<Prisma.CommentDefaultArgs>()({
  include: {
    task: true,
    user: true,
  },
});

export type CommentWithIncludes = Prisma.CommentGetPayload<
  typeof CommentWithIncludes
>;
