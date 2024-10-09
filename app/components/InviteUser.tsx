import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { ComboBox, ComboBoxItem } from "~/components/ui/ComboBox";
import { User } from "~/database/types";

export default function InviteUser() {
  const [page, setPage] = useState(1);

  const fetchUsers = (page = 1) =>
    fetch("/api/users?page=" + page).then((res) => res.json());

  const { isPending, isError, error, data } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page),
    placeholderData: {
      data: [],
      isPlaceholderData: true,
    },
  });
  return (
    <div className="flex gap-2 items-end">
      <ComboBox label="Invite User">
        {data.data.map((item: User) => (
          <ComboBoxItem key={item.id}>{item.name}</ComboBoxItem>
        ))}
      </ComboBox>
      <Button>Invite</Button>
    </div>
  );
}
