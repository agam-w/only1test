import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useServerFn } from "@tanstack/start";
import { useCallback, useMemo, useRef, useState } from "react";
import { TableBody } from "react-aria-components";
import { Button } from "~/components/ui/Button";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/Table";
import { NewInvite, NewPermission } from "~/database/types";
import {
  deleteInviteFn,
  getInvitesGivenFn,
  syncInvitePermissionsFn,
} from "~/routes/_app";
import PermissionSwitches from "./PermissionSwitches";
import { ChevronRightIcon } from "lucide-react";
import classNames from "classnames";

type InviteWithPermissions = NewInvite & {
  permissions: NewPermission[];
  expanded: boolean;
};

type Col = {
  name: string;
  id: string;
  isRowHeader?: boolean;
  key?: string;
  render?: (item?: InviteWithPermissions) => React.ReactNode;
  width?: number;
};

export default function InviteGivenTable() {
  const queryClient = useQueryClient();

  const getInviteFn = useServerFn(getInvitesGivenFn);

  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["invites-given"],
      queryFn: ({ pageParam }) =>
        getInviteFn({ page: pageParam, per_page: 20 }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.data.length ? allPages.length + 1 : undefined;
      },
    });

  const deleteMutation = useMutation({
    mutationFn: deleteInviteFn,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["invites-given"] });
    },
  });

  const syncPermissionsMutation = useMutation({
    mutationFn: syncInvitePermissionsFn,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["invites-given"] });
    },
  });

  // expanding row function
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>(
    {},
  );

  const toggleRow = (rowIndex: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  // observer
  const observer = useRef<IntersectionObserver>();

  // callback, if the last element is visible
  const lastElementRef = useCallback(
    (node: HTMLTableRowElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading],
  );

  const columns: Col[] = [
    {
      name: "",
      id: "expanded",
      render: (item) => (
        <div>
          <ChevronRightIcon
            size={16}
            className={classNames("transition", {
              "rotate-90": item?.expanded,
            })}
          />
        </div>
      ),
      width: 20,
    },
    { name: "Name", id: "name", isRowHeader: true, key: "invitee_name" },
    { name: "Date", id: "date", key: "created_at" },
    {
      name: "Permission",
      id: "permission",
      render: (item) => (
        <div>
          {item?.expanded ? (
            <PermissionSwitches
              readOnly={item.status === "rejected"}
              selectedKeys={item?.permissions.map((p) => p.permission) || []}
              onChange={(keys) => {
                console.log(item.id, keys);
                syncPermissionsMutation.mutate({
                  invite_id: item.id!,
                  permissions: keys,
                });
              }}
            />
          ) : (
            <div>
              <p>
                {item?.permissions && item.permissions.length > 0
                  ? (item?.permissions.map((p) => p.permission) || []).join(" ")
                  : "-"}
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Status",
      id: "status",
      key: "status",
      render: (item) => (
        <p
          className={classNames({
            "text-yellow-500": item?.status === "pending",
            "text-green-600": item?.status === "accepted",
            "text-red-600": item?.status === "rejected",
          })}
        >
          {item?.status}
        </p>
      ),
    },
    {
      name: "Action",
      id: "action",
      render: (item) => (
        <>
          {item?.status === "pending" || item?.status === "accepted" ? (
            <Button
              variant="destructive"
              onPress={() => {
                deleteMutation.mutate({ id: item?.id! });
              }}
            >
              Delete
            </Button>
          ) : null}
        </>
      ),
    },
  ];

  // const rows = useMemo(() => {
  //   const dataInvites = invites.data?.data || [];
  //   const dataRows: any[] = [];
  //   dataInvites.map((item) =>
  //     dataRows.push({ ...item, expanded: expandedRows[item.id!] }),
  //   );
  //   return dataRows as InviteWithPermissions[];
  // }, [invites, expandedRows]);

  const rows = useMemo(() => {
    return data?.pages
      .reduce((acc, page) => {
        return [...acc, ...page.data];
      }, [])
      .map((item) => ({ ...item, expanded: expandedRows[item.id!] }));
  }, [data, expandedRows]);

  return (
    <Table aria-label="Invites-Given">
      <TableHeader columns={columns}>
        {(column) => (
          <Column isRowHeader={column.isRowHeader} width={column.width}>
            {column.name}
          </Column>
        )}
      </TableHeader>
      <TableBody
        items={rows}
        renderEmptyState={() => (
          <div className="py-4">
            <p className="text-center text-sm text-gray-500">
              No invites given found.
            </p>
          </div>
        )}
      >
        {(item) => {
          return (
            <Row
              ref={lastElementRef}
              key={item.id}
              id={item.id}
              columns={columns}
              onAction={() => {
                toggleRow(item.id!);
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
          );
        }}
      </TableBody>
    </Table>
  );
}
