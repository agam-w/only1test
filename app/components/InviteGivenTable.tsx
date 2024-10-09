import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/start";
import { useEffect, useMemo, useState } from "react";
import { TableBody } from "react-aria-components";
import { Button } from "~/components/ui/Button";
import {
  Cell,
  Column,
  ExpandCell,
  Row,
  Table,
  TableHeader,
} from "~/components/ui/Table";
import { NewInvite, NewPermission } from "~/database/types";
import { deleteInviteFn, getInvitesGivenFn } from "~/routes/_app";
import PermissionSwitches from "./PermissionSwitches";

type InviteWithPermissions = NewInvite & {
  permissions: NewPermission[];
  expanded: boolean;
};

type Column = {
  name: string;
  id: string;
  isRowHeader?: boolean;
  key?: string;
  render?: (item?: InviteWithPermissions) => React.ReactNode;
};

export default function InviteGivenTable() {
  const queryClient = useQueryClient();

  const getInviteFn = useServerFn(getInvitesGivenFn);

  const invites = useQuery({
    queryKey: ["invites-given"],
    queryFn: () => getInviteFn({ page: 1, per_page: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInviteFn,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["invites-given"] });
    },
  });

  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>(
    {}
  );

  const toggleRow = (rowIndex: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  useEffect(() => {
    console.log(expandedRows);
  }, [expandedRows]);

  const columns: Column[] = [
    { name: "Name", id: "name", isRowHeader: true, key: "invitee_name" },
    { name: "Date", id: "date", key: "created_at" },
    {
      name: "Permission",
      id: "permission",
      render: (item) => (
        <PermissionSwitches
          selectedKeys={item?.permissions.map((p) => p.permission) || []}
        />
      ),
    },
    { name: "Status", id: "status", key: "status" },
    {
      name: "Action",
      id: "action",
      render: (item) => (
        <Button
          variant="destructive"
          onPress={() => {
            deleteMutation.mutate({ id: item?.id! });
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const rows = useMemo(() => {
    const dataInvites = invites.data?.data || [];
    const dataRows: any[] = [];
    dataInvites.map((item) =>
      dataRows.push({ ...item, expanded: expandedRows[item.id!] })
    );
    return dataRows as InviteWithPermissions[];
  }, [invites, expandedRows]);

  return (
    <Table
      aria-label="Invites-Given"
      // selectionMode="multiple"
      // selectionBehavior="replace"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <Column isRowHeader={column.isRowHeader}>{column.name}</Column>
        )}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => {
          return (
            <Row
              key={item.id}
              id={item.id}
              columns={columns}
              onAction={() => {
                toggleRow(item.id!);
              }}
            >
              {(column) => (
                <Cell>
                  {!item.expanded ? (
                    <>
                      {column.render
                        ? column.render(item)
                        : column.key
                          ? item[column.key]
                          : ""}
                    </>
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
  );
}
