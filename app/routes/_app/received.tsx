import { createFileRoute } from "@tanstack/react-router";
import InviteReceivedTable from "~/components/InviteReceivedTable";

export const Route = createFileRoute("/_app/received")({
  meta: () => [
    {
      title: "Invites Received | App",
    },
  ],
  component: AppHome,
});

function AppHome() {
  // const { user } = Route.useRouteContext();

  return (
    <div>
      <div className="container py-6 px-4">
        <div>
          <div className="flex flex-col gap-4">
            <p className="text-lg font-bold">Invites Received</p>
            <InviteReceivedTable />
          </div>
        </div>
      </div>
    </div>
  );
}
