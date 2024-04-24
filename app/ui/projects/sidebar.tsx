"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

export default function Sidebar({ selectedView }: { selectedView: string }) {
  return (
    <>
      <Table
        color="primary"
        radius="none"
        shadow="none"
        selectionMode="single"
        defaultSelectedKeys={[selectedView]}
        hideHeader
      >
        <TableHeader>
          <TableColumn>Project Name</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow className="h-12" key="table">
            <TableCell>Backlog Table</TableCell>
          </TableRow>
          <TableRow className="h-12" key="board">
            <TableCell>Kanban Board</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
