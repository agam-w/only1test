import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DialogTrigger, Heading } from "react-aria-components";
import { Button } from "~/components/ui/Button";
import { ComboBox, ComboBoxItem } from "~/components/ui/ComboBox";
import { User } from "~/database/types";
import { inviteUserFn } from "~/routes/_app";
import { Modal } from "./ui/Modal";
import { Dialog } from "./ui/Dialog";
import PermissionSwitches from "./PermissionSwitches";
import { AvailablePermission } from "~/utils/permission";
import useDebounced from "~/hooks/useDebounced";

export default function InviteUser() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<
    AvailablePermission[]
  >([]);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 500);
  const [page, setPage] = useState(1);

  const fetchUsers = ({ q, page = 1 }: { q?: string; page?: number }) =>
    fetch(`/api/users?q=${q}&page=${page}&per_page=20`).then((res) =>
      res.json(),
    );

  const { isPending, isError, error, data } = useQuery({
    queryKey: ["users", debouncedQuery, page],
    queryFn: () => fetchUsers({ q: debouncedQuery, page }),
    placeholderData: {
      data: [],
      isPlaceholderData: true,
    },
  });

  const queryClient = useQueryClient();

  // invite user Mutations
  const inviteUserMutation = useMutation({
    mutationFn: inviteUserFn,
    onSuccess: () => {
      setSelectedId(null);
      setSelectedUser(null);
      setSelectedPermissions([]);
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  return (
    <div className="flex gap-2 items-end">
      <ComboBox
        label="Invite User"
        selectedKey={selectedId}
        onInputChange={(val) => {
          setQuery(val);
        }}
        onSelectionChange={(val) => {
          setSelectedId(Number(val));
          setSelectedUser(data.data.find((user: User) => user.id == val));
        }}
      >
        {data.data.map((item: User) => (
          <ComboBoxItem key={item.id} id={item.id}>
            {item.name}
          </ComboBoxItem>
        ))}
      </ComboBox>

      <DialogTrigger>
        <Button isDisabled={selectedUser == null}>Invite</Button>
        <Modal isKeyboardDismissDisabled>
          <Dialog>
            {({ close }) => (
              <div className="flex flex-col gap-4">
                <h1 className="text-xl font-bold">Invite User</h1>

                <p>You are inviting:</p>
                <div className="flex gap-4 text-sm">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">Name</div>
                    <div className="font-medium">Username</div>
                    <div className="font-medium">Email</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div>{selectedUser?.name}</div>
                    <div>{selectedUser?.username}</div>
                    <div>{selectedUser?.email}</div>
                  </div>
                </div>

                <p className="font-medium">Permissions</p>

                <PermissionSwitches
                  onChange={(keys) => {
                    setSelectedPermissions(keys);
                  }}
                />

                <div className="flex gap-2 justify-end">
                  <Button
                    onPress={() => {
                      if (!selectedId) return;
                      inviteUserMutation.mutate({
                        user_id: selectedId,
                        permissions: selectedPermissions,
                      });
                      close();
                    }}
                  >
                    Invite
                  </Button>
                  <Button variant="secondary" onPress={close}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Dialog>
        </Modal>
      </DialogTrigger>
    </div>
  );
}
