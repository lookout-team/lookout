"use client";

import { ActivityWithIncludes } from "@/lib/db/types";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { getDuration } from "../utils";

export default function ActivityCard({
  activity,
}: {
  activity: ActivityWithIncludes;
}) {
  const itemDetails = [];
  const item = JSON.parse(activity.changes);

  for (const key in item) {
    if (!item[key]) continue;
    itemDetails.push(
      <p key={key} className="text-medium">
        <b>{key}:</b> {item[key]}
      </p>
    );
  }

  return (
    <Card shadow="none" className="mb-6 border-1">
      <CardHeader>{activity.description}</CardHeader>
      <Divider />
      <CardBody className="p-4">{itemDetails}</CardBody>
      <Divider />
      <CardFooter>{getDuration(activity.timestamp)}</CardFooter>
    </Card>
  );
}
