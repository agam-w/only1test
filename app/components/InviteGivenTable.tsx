import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/start";
import { TableBody } from "react-aria-components";
import { Button } from "~/components/ui/Button";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/Table";
import { NewInvite, NewPermission } from "~/database/types";
import { deleteInviteFn, getInvitesGivenFn } from "~/routes/_app";

type InviteWithPermissions = NewInvite & {
  permissions: NewPermission[];
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

  const columns: Column[] = [
    { name: "Name", id: "name", isRowHeader: true, key: "invitee_name" },
    { name: "Date", id: "date", key: "created_at" },
    {
      name: "Permission",
      id: "permission",
      render: (item) => <p>{item?.permissions.join(" ")}</p>,
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

  const rows = invites.data?.data as InviteWithPermissions[];

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
                {column.render
                  ? column.render(item)
                  : column.key
                    ? item[column.key]
                    : ""}
              </Cell>
            )}
          </Row>
        )}
      </TableBody>
    </Table>
  );
}
