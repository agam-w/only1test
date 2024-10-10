import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
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
import { useServerFn } from "@tanstack/start";

export default function InviteUser() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<
    AvailablePermission[]
  >([]);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 300);

  const [error, setError] = useState<string | null>(null);

  const fetchUsers = ({ q, page = 1 }: { q?: string; page?: number }) =>
    fetch(`/api/users?q=${q}&page=${page}&per_page=20`).then(
      async (res) => (await res.json()) as { data: User[] },
    );

  const { data } = useQuery({
    queryKey: ["users", debouncedQuery],
    queryFn: () => fetchUsers({ q: debouncedQuery }),
    placeholderData: {
      data: [],
    },
  });

  const options = useMemo(() => {
    return (
      data?.data.map((item) => ({
        id: item.id,
        name: item.name,
      })) || []
    );
  }, [data]);

  const queryClient = useQueryClient();

  const inviteUser = useServerFn(inviteUserFn);

  // invite user Mutations
  const inviteUserMutation = useMutation({
    mutationFn: inviteUser,
    onSuccess: () => {
      setQuery("");
      setSelectedId(null);
      setSelectedUser(null);
      setSelectedPermissions([]);
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
    onError: (err) => {
      // console.log(err.message);
      setError(err.message);
    },
  });

  return (
    <div className="flex gap-2 items-end">
      <ComboBox
        label="Invite User"
        selectedKey={selectedId}
        items={options}
        inputValue={query}
        onInputChange={(val) => {
          setQuery(val);
        }}
        onSelectionChange={(val) => {
          setSelectedId(Number(val));
          const user = data?.data.find((user: User) => user.id == val);
          if (user) {
            setSelectedUser(user);
            setQuery(user.name!);
          }
        }}
      >
        {(item) => (
          <ComboBoxItem key={item.id} id={item.id}>
            {item.name}
          </ComboBoxItem>
        )}
      </ComboBox>

      <DialogTrigger>
        <Button
          isDisabled={selectedUser == null}
          onPress={() => setError(null)}
        >
          Invite
        </Button>
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

                {error ? <p className="text-sm text-red-500">{error}</p> : null}

                <div className="flex gap-2 justify-end">
                  <Button
                    onPress={() => {
                      if (!selectedId) return;
                      inviteUserMutation.mutate({
                        user_id: selectedId,
                        permissions: selectedPermissions,
                      });
                      if (inviteUserMutation.isSuccess) close();
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
