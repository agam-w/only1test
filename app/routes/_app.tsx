import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import {
  createInvite,
  deleteInvite,
  findInviteById,
  findInvites,
} from "~/repositories/invite";
import { findPermissions } from "~/repositories/permission";
import { useAppSession } from "~/utils/session";

export const inviteUserFn = createServerFn(
  "POST",
  async (payload: { user_id: number }) => {
    const session = await useAppSession();

    await createInvite({
      invitee_id: payload.user_id,
      inviter_id: session.data.id,
      status: "pending",
    });

    return { success: true, message: "Invite sent successfully" };
  },
);

export const getInvitesGivenFn = createServerFn(
  "GET",
  async (payload: { page: number; per_page: number }) => {
    const session = await useAppSession();
    const currentUserId = session.data.id;

    const page = payload.page || 1;
    const per_page = payload.per_page || 10;
    // convert page and per_page to limit and offset
    const limit = per_page;
    const offset = (page - 1) * per_page;

    const invites = await findInvites(
      {
        inviter_id: currentUserId,
      },
      limit,
      offset,
    );

    // attach permission to each invite
    const dataPromises = invites.map(async (invite) => {
      const permissions = await findPermissions({ invite_id: invite.id });
      return {
        ...invite,
        created_at: invite.created_at.toISOString(),
        permissions: permissions.map((permission) => ({
          ...permission,
          created_at: permission.created_at.toISOString(),
        })),
      };
    });

    const data = await Promise.all(dataPromises);

    return {
      data,
      page,
      per_page,
      total: invites.length,
    };
  },
);

export const deleteInviteFn = createServerFn(
  "POST",
  async (payload: { id: number }) => {
    const session = await useAppSession();

    const invite = await findInviteById(payload.id);
    if (invite?.inviter_id != session.data.id) {
      return { success: false, message: "You are not the inviter" };
    }

    await deleteInvite(payload.id);
    return { success: true, message: "Invite deleted successfully" };
  },
);

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
