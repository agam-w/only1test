import { useQuery } from "@tanstack/react-query";
import { TableBody } from "react-aria-components";
import { Button } from "~/components/ui/Button";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/Table";
import { getInvitesGivenFn } from "~/routes/_app";

export default function InviteGivenTable() {
  const invites = useQuery({
    queryKey: ["invites-given"],
    queryFn: () => getInvitesGivenFn({ page: 1, per_page: 10 }),
  });

  const columns = [
    { name: "Name", id: "name", isRowHeader: true },
    { name: "Date", id: "date" },
    { name: "Permission", id: "permission" },
    { name: "Status", id: "status" },
    { name: "Action", id: "action" },
  ];

  const rows = [
    {
      id: 1,
      name: "John Doe",
      date: "2022-01-01",
      permission: "Read",
      status: "Pending",
    },
    {
      id: 2,
      name: "Jane Doe",
      date: "2022-01-02",
      permission: "Read",
      status: "Pending",
    },
    {
      id: 3,
      name: "John Doe",
      date: "2022-01-01",
      permission: "Read",
      status: "Pending",
    },
    {
      id: 4,
      name: "Jane Doe",
      date: "2022-01-02",
      permission: "Read",
      status: "Pending",
    },
  ];
  return (
    <Table
      aria-label="Invites-Given"
      selectionMode="multiple"
      selectionBehavior="replace"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <Column isRowHeader={column.isRowHeader}>{column.name}</Column>
        )}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <Row
            key={item.id}
            id={item.id}
            columns={columns}
            onAction={() => {
              console.log("click", item);
            }}
          >
            {(column) => (
              <Cell>
                {column.id == "action" ? (
                  <Button variant="destructive">Delete</Button>
                ) : (
                  <>{item[column.id]}</>
                )}
              </Cell>
            )}
          </Row>
        )}
      </TableBody>
    </Table>
  );
}
