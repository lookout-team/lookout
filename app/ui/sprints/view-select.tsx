"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";

export default function ViewSelect({ selectedView }: { selectedView: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function selectView(view: string) {
    router.push(`${pathname}?view=${view}`)
  }

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
          <TableRow
            className="h-12"
            key="table"
            onClick={() => selectView("table")}
          >
            <TableCell>Backlog Table</TableCell>
          </TableRow>
          <TableRow
            className="h-12"
            key="board"
            onClick={() => selectView("board")}
          >
            <TableCell>Kanban Board</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
