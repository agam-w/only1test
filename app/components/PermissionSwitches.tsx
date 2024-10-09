import { Switch } from "./ui/Switch";
import { AvailablePermission, availablePermissions } from "~/utils/permission";

export default function PermissionSwitches({
  selectedKeys,
}: {
  selectedKeys: AvailablePermission[];
}) {
  return (
    <div className="grid grid-cols-2">
      {availablePermissions.map((permission) => (
        <Switch defaultSelected={selectedKeys.includes(permission)}>
          {permission}
        </Switch>
      ))}
    </div>
  );
}
