import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { ComboBox, ComboBoxItem } from "~/components/ui/ComboBox";
import { User } from "~/database/types";
import { inviteUserFn } from "~/routes/_app";

export default function InviteUser() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
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

  // invite user Mutations
  const inviteUserMutation = useMutation({
    mutationFn: inviteUserFn,
    onSuccess: () => {
      // Invalidate and refetch
      //
      console.log("success");
    },
  });

  return (
    <div className="flex gap-2 items-end">
      <ComboBox
        label="Invite User"
        selectedKey={selectedId}
        onSelectionChange={(val) => {
          setSelectedId(Number(val));
        }}
      >
        {data.data.map((item: User) => (
          <ComboBoxItem key={item.id} id={item.id}>
            {item.name}
          </ComboBoxItem>
        ))}
      </ComboBox>
      <Button
        onPress={() => {
          if (!selectedId) return;
          inviteUserMutation.mutate({ user_id: selectedId });
        }}
      >
        Invite
      </Button>
    </div>
  );
}
