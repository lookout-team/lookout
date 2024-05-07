"use client";

import { DateInput, Input } from "@nextui-org/react";
import { Sprint } from "@prisma/client";
import { useState } from "react";
import { CalendarDate } from "@internationalized/date";

function toCalendarDate(date: Date | null | undefined) {
  if (date === undefined || date === null) return date;
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return new CalendarDate(year, month, day);
}

export default function SprintForm({ sprint }: { sprint?: Sprint }) {
  const now = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [title, setTitle] = useState(sprint?.title);
  const [startDate, setStartDate] = useState(sprint?.start_date);
  const [endDate, setEndDate] = useState(sprint?.end_date);
  const [capacity, setCapacity] = useState(sprint?.planned_capacity);

  return (
    <>
      {sprint && <input type="hidden" name="id" value={sprint.id} />}
      <Input
        className="mb-2"
        variant="bordered"
        label="Title"
        name="title"
        value={title ?? undefined}
        onChange={(e) => setTitle(e.target.value)}
      />
      <DateInput
        className="mb-2"
        variant="bordered"
        label="Start Date"
        name="start_date"
        value={toCalendarDate(startDate)}
        onChange={(x) => setStartDate(x.toDate(timezone))}
      />
      <DateInput
        className="mb-2"
        variant="bordered"
        label="End Date"
        name="end_date"
        value={toCalendarDate(endDate)}
        onChange={(x) => setEndDate(x.toDate(timezone))}
      />
      <Input
        type="numeric"
        variant="bordered"
        label="Planned Capacity"
        name="planned_capacity"
        value={capacity?.toString()}
        onChange={(e) => setCapacity(+e.target.value)}
      />
    </>
  );
}
