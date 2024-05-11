import { Activity } from "@prisma/client";
import { ActivityWithIncludes } from "./types";
import prisma from "./prisma";

/**
 * Creates an activity log entry.
 *
 * @param {Omit<Activity, "id">} params - Activity log details
 * @returns {Promise<Activity>} - Created activity log entry
 */
export async function createActivityLog(
  params: Omit<Activity, "id">
): Promise<Activity> {
  const activity = await prisma.activity.create({
    data: {
      ...params,
    },
  });
  return activity;
}

/**
 * Retrieves an activity log entry.
 *
 * @param {Partial<Activity>} params - Activity log details
 * @returns {Promise<ActivityWithIncludes | null>} - Activity log entry, if found
 */
export async function getActivityLogEntry(
  params: Partial<Activity>
): Promise<ActivityWithIncludes | null> {
  const activity = await prisma.activity.findFirst({
    where: {
      ...params,
    },
    include: {
      user: true,
      task: true,
    },
  });
  return activity;
}

/**
 * Retrieves activity log entries
 *
 * @param {Partial<Activity>} params - Activity log parameters
 * @returns {Promise<ActivityWithIncludes[]>} - Array of activity log entries, if found
 */
export async function getActivityLogs(
  params?: Partial<Activity>
): Promise<ActivityWithIncludes[]> {
  const activityLogs = await prisma.activity.findMany({
    where: {
      ...params,
    },
    include: {
      user: true,
      task: true,
    },
  });
  return activityLogs;
}
