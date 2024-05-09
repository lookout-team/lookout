import { Activity } from "@prisma/client";
import { ActivityWithIncludes } from "./types";
import prisma from "./prisma";

export async function createActivity(
  params: Omit<Activity, "id">
): Promise<Activity> {
  const activity = await prisma.activity.create({
    data: {
      ...params,
    },
  });
  return activity;
}

export async function getActivity(
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

export async function getActivities(
  params: Partial<Activity>
): Promise<ActivityWithIncludes[]> {
  const activity = await prisma.activity.findMany({
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

export async function updateActivity(
  params: Partial<Activity>
): Promise<Activity> {
  const activity = await prisma.activity.update({
    where: { id: params.id },
    data: { ...params },
  });
  return activity;
}

export async function deleteActivity(id: number): Promise<Activity> {
  const activity = await prisma.activity.delete({
    where: { id: id },
  });
  return activity;
}
