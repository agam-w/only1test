import { createFileRoute } from "@tanstack/react-router";
import InviteGivenTable from "~/components/InviteGivenTable";
import InviteUser from "~/components/InviteUser";

export const Route = createFileRoute("/_app/")({
  meta: () => [
    {
      title: "Invites Given | App",
    },
  ],
  component: AppHome,
});

function AppHome() {
  // const { user } = Route.useRouteContext();

  return (
    <div>
      <div className="container py-6 px-4">
        <div className="flex flex-col gap-4">
          <p className="text-lg font-bold">Invites Given</p>
          <InviteUser />
          <InviteGivenTable />
        </div>
      </div>
    </div>
  );
}
