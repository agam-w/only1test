import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import classNames from "classnames";
import { Cat, ChevronRight, Menu, User, UserCircleIcon, X } from "lucide-react";
import { useState } from "react";
import { setResponseStatus } from "vinxi/http";
import { NewPermission } from "~/database/types";
import {
  createInvite,
  deleteInvite,
  findInvite,
  findInviteById,
  findInvites,
  updateInvite,
} from "~/repositories/invite";
import {
  createPermission,
  deleteAllPermissionsByInviteId,
  findPermissions,
} from "~/repositories/permission";
import { AvailablePermission } from "~/utils/permission";
import { useAppSession } from "~/utils/session";

export const inviteUserFn = createServerFn(
  "POST",
  async (payload: { user_id: number; permissions: AvailablePermission[] }) => {
    const session = await useAppSession();

    const exist = await findInvite({ invitee_id: payload.user_id });
    if (exist) {
      return new Response("User already invited", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    const invite = await createInvite({
      invitee_id: payload.user_id,
      inviter_id: session.data.id,
      status: "pending",
    });

    if (payload.permissions.length > 0) {
      const newPermissions: NewPermission[] = payload.permissions.map(
        (permission) => ({
          invite_id: invite.id,
          user_id: payload.user_id,
          permission,
        }),
      );
      await createPermission(newPermissions);
    }

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

    // find invites given by current user
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

export const getInvitesReceivedFn = createServerFn(
  "GET",
  async (payload: { page: number; per_page: number }) => {
    const session = await useAppSession();
    const currentUserId = session.data.id;

    const page = payload.page || 1;
    const per_page = payload.per_page || 10;
    // convert page and per_page to limit and offset
    const limit = per_page;
    const offset = (page - 1) * per_page;

    // find invites received by current user
    const invites = await findInvites(
      {
        invitee_id: currentUserId,
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
    await deleteAllPermissionsByInviteId(payload.id);
    return { success: true, message: "Invite deleted successfully" };
  },
);

export const approvalInviteFn = createServerFn(
  "POST",
  async (payload: { id: number; status: "accepted" | "rejected" }) => {
    const session = await useAppSession();

    const invite = await findInviteById(payload.id);
    if (invite?.invitee_id != session.data.id) {
      return { success: false, message: "You are not the invitee" };
    }

    await updateInvite(payload.id, { status: payload.status });
    return { success: true, message: `Invite ${payload.status} successfully` };
  },
);

// delete and attach new permissions to invite
export const syncInvitePermissionsFn = createServerFn(
  "POST",
  async (payload: {
    invite_id: number;
    permissions: AvailablePermission[];
  }) => {
    const session = await useAppSession();

    const invite = await findInviteById(payload.invite_id);
    if (invite?.inviter_id != session.data.id) {
      return { success: false, message: "You are not the inviter" };
    }

    // delete all old permissions for this invite
    await deleteAllPermissionsByInviteId(payload.invite_id);

    if (payload.permissions.length > 0) {
      const newPermissions: NewPermission[] = payload.permissions.map(
        (permission) => ({
          invite_id: payload.invite_id,
          user_id: invite.invitee_id,
          permission,
        }),
      );
      await createPermission(newPermissions);
    }

    return { success: true, message: "Invite permissions synced successfully" };
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
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Invites Given", path: "/" },
    { name: "Invites Received", path: "/received" },
  ];

  return (
    <div>
      <div className="shadow h-14">
        <div className="container flex justify-between items-center px-4 h-14">
          <nav className="hidden md:flex gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={classNames(
                  "font-medium border-b-2 hover:text-black hover:border-b-indigo-500 flex items-center justify-center py-4 transition",
                  {
                    "border-b-indigo-500 text-black":
                      link.path === location.pathname,
                    "text-gray-500": link.path !== location.pathname,
                  },
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden flex items-center justify-center text-gray-700"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu />
          </button>

          <div className="flex gap-2 items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p>{user?.name}</p>
            </div>
            <Link
              to="/logout"
              className="hidden md:block font-medium text-gray-500 hover:text-black transition"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>

      {/* mobile menu drawer */}
      <div
        className={classNames(
          "fixed shadow z-50 top-0 bottom-0 left-0 right-0 w-screen h-screen md:hidden bg-white transition duration-300 border-r border-r-gray-100",
          {
            "translate-x-0": isMenuOpen,
            "-translate-x-full": !isMenuOpen,
          },
        )}
      >
        <div className="container flex justify-end items-center px-4 h-14">
          <button
            className="md:hidden flex items-center justify-center text-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={classNames(
                "font-medium hover:text-black flex items-center px-4 py-2 transition",
                {
                  "text-black": link.path === location.pathname,
                  "text-gray-500": link.path !== location.pathname,
                },
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <p>{link.name}</p>
            </Link>
          ))}

          <Link
            to="/logout"
            className={classNames(
              "font-medium hover:text-black flex items-center px-4 py-2 transition",
              "text-gray-500",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <p>Logout</p>
          </Link>
        </nav>
      </div>

      <Outlet />
    </div>
  );
}
