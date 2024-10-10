import { useState } from "react";
import { Switch } from "./ui/Switch";
import { AvailablePermission, availablePermissions } from "~/utils/permission";

export default function PermissionSwitches({
  selectedKeys,
  onChange,
  readOnly,
}: {
  selectedKeys?: AvailablePermission[];
  onChange?: (keys: AvailablePermission[]) => void;
  readOnly?: boolean;
}) {
  const [selectedKeysState, setSelectedKeysState] = useState<
    AvailablePermission[]
  >(selectedKeys || []);

  const handleChange = (key: AvailablePermission) => {
    if (selectedKeysState.includes(key)) {
      // remove key from list
      const newKeys = selectedKeysState.filter((k) => k !== key);
      setSelectedKeysState(newKeys);
      onChange?.(newKeys);
    } else {
      // add key to list
      // console.log("add key:", key);

      // when write permission is selected, also select the read permission
      const pairKey: AvailablePermission | null =
        key === "posts_write"
          ? "posts_read"
          : key === "messages_write"
            ? "messages_read"
            : key === "profile_write"
              ? "profile_read"
              : null;
      // console.log("pair:", pairKey);

      const newKeys = [...selectedKeysState, key, pairKey].filter(
        (k) => k !== null,
      );
      setSelectedKeysState(newKeys);
      onChange?.(newKeys);
    }
  };

  return (
    <div className="grid grid-cols-2">
      {availablePermissions.map((permission) => (
        <Switch
          key={permission}
          defaultSelected={selectedKeys?.includes(permission)}
          isSelected={selectedKeysState.includes(permission)}
          isReadOnly={readOnly}
          onChange={(checked) => handleChange(permission)}
        >
          {permission}
        </Switch>
      ))}
    </div>
  );
}
