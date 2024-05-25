import { auth } from "../auth/auth";
import { Activity } from "@prisma/client";
import { ActivityWithIncludes } from "./types";
import prisma from "./prisma";
import { getUser } from "./user";

const inclusions = {
  project: true,
  sprint: true,
  task: true,
  user: true,
  comment: true,
};

/**
 * Creates an activity log entry.
 *
 * @param type - Type of action ("Create", "Update", or "Delete")
 * @param entity - Model that was changed
 * @param entity_id - ID of the entity that was changed
 * @returns {Promise<Activity>} - The created activity log entry
 */
export async function createActivityLog(
  type: string,
  entity: string,
  entityId: number
): Promise<Activity> {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    throw new Error("User is not authenticated");
  }

  const userId = +session.user.id;
  const user = await getUser({ id: userId });
  const description = `@${user?.username} ${type.toLowerCase()}d a new ${entity}.`;

  const activity = await prisma.activity.create({
    data: {
      description: description,
      type: type,
      timestamp: new Date(),
      user_id: userId,
      [`${entity}_id`]: entityId,
    },
  });

  console.log(activity);

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
    where: { ...params },
    include: inclusions,
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
    where: { ...params },
    include: inclusions,
  });
  return activityLogs;
}
