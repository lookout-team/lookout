"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

export default function BacklogTable() {
  const columns = ["Title", "Points", "Assigned To", "Priority"];
  const dummyData = [
    "Create Kanban Board component",
    "5",
    "Wasim Sandhu",
    "High",
  ];

  const tableRows = [];

  for (let i = 0; i < 10; i++) {
    tableRows.push(
      <TableRow>
        {dummyData.map((data) => (
          <TableCell>{data}</TableCell>
        ))}
      </TableRow>
    );
  }

  return (
    <>
      <Table
        color="primary"
        selectionMode="single"
        defaultSelectedKeys={["2"]}
        aria-label="Example static collection table"
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn>{column}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </>
  );
}
