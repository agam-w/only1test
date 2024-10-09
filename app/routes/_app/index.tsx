import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({
  component: AppHome,
});

function AppHome() {
  const { user } = Route.useRouteContext();

  return (
    <div>
      <div className="container py-2">
        <p>Hello {user?.username}!</p>
        <p>{user?.email}</p>
      </div>
    </div>
  );
}
