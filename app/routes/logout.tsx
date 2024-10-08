import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { useAppSession } from "~/utils/session";

const logoutFn = createServerFn("POST", async () => {
  // Clear the session
  const session = await useAppSession();
  await session.clear();

  throw redirect({
    href: "/",
  });
});

export const Route = createFileRoute("/logout")({
  preload: false,
  loader: () => logoutFn(),
});
