import { useState } from "react";
import { Switch } from "./ui/Switch";
import { AvailablePermission, availablePermissions } from "~/utils/permission";

export default function PermissionSwitches({
  selectedKeys,
  onChange,
}: {
  selectedKeys?: AvailablePermission[];
  onChange?: (keys: AvailablePermission[]) => void;
}) {
  const [selectedKeysState, setSelectedKeysState] = useState<
    AvailablePermission[]
  >(selectedKeys || []);

  const handleChange = (key: AvailablePermission) => {
    if (selectedKeysState.includes(key)) {
      const newKeys = selectedKeysState.filter((k) => k !== key);
      setSelectedKeysState(newKeys);
      onChange?.(newKeys);
    } else {
      const newKeys = [...selectedKeysState, key];
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
          onChange={(checked) => handleChange(permission)}
        >
          {permission}
        </Switch>
      ))}
    </div>
  );
}
