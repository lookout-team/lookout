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
    tasks: true,
  },
});

export type SprintWithIncludes = Prisma.SprintGetPayload<
  typeof SprintWithIncludes
>;

const UserWithIncludes = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    task: true,
    activity: true,
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
    user: true,
    task: true,
  },
});

export type CommentWithIncludes = Prisma.CommentGetPayload<
  typeof CommentWithIncludes
>;

const ChatWithIncludes = Prisma.validator<Prisma.ChatDefaultArgs>()({
  include: {
    user: true,
  },
});

export type ChatWithIncludes = Prisma.ChatGetPayload<typeof ChatWithIncludes>;

export interface deleteConversationHistoryResult {
  count: number;
}
