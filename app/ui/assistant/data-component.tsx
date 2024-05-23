"use client";

import {
  Button,
  Card,
  CardBody,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Check } from "lucide-react";
import { useRef, useState } from "react";

export interface Props {
  data: any[];
  status: string;
  type: string;
  buttonAction: (action: string) => void;
  isActionable: boolean;
}

export default function DataComponent(props: Props) {
  const { data, status, type } = props;

  let dataComponent = <></>;

  if (data.length > 1) {
    // Table component
    const tableRows = [];

    const tableColumns = Object.keys(data[0]).map((column) => (
      <TableColumn key={column}>{column}</TableColumn>
    ));

    for (const item of data) {
      let rowKey = null;
      const tableCells = [];

      for (const key in item) {
        if (!rowKey) rowKey = item[key];
        tableCells.push(
          <TableCell key={`${rowKey}_${item[key]}`}>{item[key]}</TableCell>
        );
      }

      tableRows.push(<TableRow key={`Row_${rowKey}`}>{tableCells}</TableRow>);
    }

    dataComponent = (
      <Table>
        <TableHeader>{tableColumns}</TableHeader>
        <TableBody>{tableRows}</TableBody>
      </Table>
    );
  }

  if (data.length == 1) {
    // Card component
    const item = data[0];
    const itemDetails = [];

    for (const key in item) {
      itemDetails.push(
        <p key={key} className="text-medium">
          <b>{key}:</b> {item[key]}
        </p>
      );
    }

    dataComponent = (
      <>
        <Card shadow="sm" className="p-2">
          <CardBody>{itemDetails}</CardBody>
        </Card>
      </>
    );
  }

  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  function sendAction(action: string) {
    props.buttonAction(action);
    setIsDisabled(true);
  }

  return (
    <div>
      {dataComponent}
      <div className="mt-4">
        {status === "pending" && props.isActionable && (
          <div className="flex items-row gap-2">
            <Button
              isDisabled={isDisabled}
              ref={cancelRef}
              color="default"
              fullWidth={true}
              onClick={() => sendAction("Cancel action")}
            >
              Cancel
            </Button>
            <Button
              isDisabled={isDisabled}
              ref={confirmRef}
              color="primary"
              fullWidth={true}
              onClick={() => sendAction("Confirm action")}
            >
              Confirm
            </Button>
          </div>
        )}
        {status === "confirmed" && type === "write" && (
          <Button color="success" fullWidth isDisabled>
            <Check /> Confirmed
          </Button>
        )}
      </div>
    </div>
  );
}
