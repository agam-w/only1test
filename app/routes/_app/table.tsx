import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TableBody } from "react-aria-components";
import InviteUser from "~/components/InviteUser";
import { Button } from "~/components/ui/Button";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/Table";

export const Route = createFileRoute("/_app/table")({
  component: AppHome,
});

function AppHome() {
  const { user } = Route.useRouteContext();
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (rowIndex) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

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
    <div>
      <div className="container py-2 px-4">
        <div className="mb-4">
          <p>Hello {user?.username}!</p>
          <p>{user?.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <p className="text-lg font-bold">Invites Given</p>
            <InviteUser />

            <Table
              aria-label="Invites-Given"
              // selectionMode="multiple"
              // selectionBehavior="replace"
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <Column isRowHeader={column.isRowHeader}>
                    {column.name}
                  </Column>
                )}
              </TableHeader>
              <TableBody items={rows}>
                {(item) => {
                  return (
                    <Row
                      key={item.id}
                      columns={columns}
                      onAction={() => {
                        toggleRow(item.id);
                        console.log({ item, columns });
                      }}
                    >
                      {(column) => (
                        <Cell>
                          {column.id == "action" ? (
                            <Button variant="destructive">Delete</Button>
                          ) : !expandedRows[item.id] ? (
                            <>{item[column.id]}</>
                          ) : (
                            <div>
                              'detail info'
                              <br />
                              'detail info'
                              <br />
                              'detail info'
                              <br />
                              'detail info'
                            </div>
                          )}
                        </Cell>
                      )}
                    </Row>
                  );
                }}
              </TableBody>
            </Table>
          </div>
          <div>
            <p className="text-lg font-bold">Invites Received</p>
          </div>
        </div>
      </div>
    </div>
  );
}
