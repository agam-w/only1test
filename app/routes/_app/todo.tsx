import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useRef } from "react";
import { TableBody } from "react-aria-components";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/Table";

const MAX_POST_PAGE = 20;

interface TodoType {
  id: number;
  title: string;
}

const fetchTodos = async ({ pageParam }: { pageParam: number }) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos?_page=${pageParam}&_limit=${MAX_POST_PAGE}`,
  );
  const todos = (await response.json()) as TodoType[];
  return todos;
};

export const Route = createFileRoute("/_app/todo")({
  component: TodoTable,
});

function TodoTable() {
  const observer = useRef<IntersectionObserver>();

  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["todos"],
      queryFn: ({ pageParam }) => fetchTodos({ pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
      },
    });

  const columns = [
    { name: "id", id: "id", width: 10 },
    { name: "Name", id: "title", isRowHeader: true },
  ];

  const rows = useMemo(() => {
    return data?.pages.reduce((acc, page) => {
      return [...acc, ...page];
    }, []);
  }, [data]);

  const lastElementRef = useCallback(
    (node: HTMLTableRowElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          console.log("fetch next page");
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading],
  );

  return (
    <div className="container py-6 px-4">
      <Table aria-label="Todos">
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
              <p className="text-center text-sm text-gray-500">No data.</p>
            </div>
          )}
        >
          {(item) => {
            return (
              <Row
                key={item.id}
                id={item.id}
                columns={columns}
                ref={lastElementRef}
              >
                {(column) => <Cell>{item[column.id]}</Cell>}
              </Row>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
}
