import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: App,
});

function App() {
  const { user } = Route.useRouteContext();

  return (
    <div>
      <div className="bg-gray-200">
        <div className="container flex justify-between items-center py-2 px-4">
          <div>
            <a href="/" className="font-medium">
              Home
            </a>
          </div>

          <div className="flex gap-2">
            <div>
              <p>{user?.username}</p>
            </div>
            <a href="/logout" className="font-medium">
              Logout
            </a>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
