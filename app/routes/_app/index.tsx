import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/Button";
import { ComboBox, ComboBoxItem } from "~/components/ui/ComboBox";

export const Route = createFileRoute("/_app/")({
  component: AppHome,
});

function AppHome() {
  const { user } = Route.useRouteContext();

  return (
    <div>
      <div className="container py-2">
        <div className="mb-4">
          <p>Hello {user?.username}!</p>
          <p>{user?.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2 text-lg font-bold">Invites Given</p>
            <div className="flex gap-2 items-end">
              <ComboBox label="Invites user">
                <ComboBoxItem>Chocolate</ComboBoxItem>
                <ComboBoxItem id="mint">Mint</ComboBoxItem>
                <ComboBoxItem>Strawberry</ComboBoxItem>
                <ComboBoxItem>Vanilla</ComboBoxItem>
              </ComboBox>
              <Button>Invite</Button>
            </div>
          </div>
          <div>
            <p className="text-lg font-bold">Invites Received</p>
          </div>
        </div>
      </div>
    </div>
  );
}
