import { createFileRoute } from "@tanstack/react-router";
import InviteGivenTable from "~/components/InviteGivenTable";
import InviteReceivedTable from "~/components/InviteReceivedTable";
import InviteUser from "~/components/InviteUser";

export const Route = createFileRoute("/_app/")({
  component: AppHome,
});

function AppHome() {
  const { user } = Route.useRouteContext();

  return (
    <div>
      <div className="container py-2 px-4">
        <div className="mb-4">
          <p>Hello {user?.username}!</p>
          <p>{user?.email}</p>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-lg font-bold">Invites Given</p>
            <InviteUser />
            <InviteGivenTable />
          </div>
          <div>
            <div className="flex flex-col gap-4">
              <p className="text-lg font-bold">Invites Received</p>
              <InviteReceivedTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
