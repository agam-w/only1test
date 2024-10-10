import { createRootRoute } from "@tanstack/react-router";
import { Outlet, ScrollRestoration } from "@tanstack/react-router";
import {
  Body,
  createServerFn,
  Head,
  Html,
  Meta,
  Scripts,
} from "@tanstack/start";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import appCss from "~/styles/app.css?url";
import { useAppSession } from "~/utils/session";

const fetchUser = createServerFn("GET", async () => {
  // We need to auth on the server so we have access to secure cookies
  const session = await useAppSession();

  if (!session.data.username) {
    return null;
  }

  return {
    id: session.data.id,
    username: session.data.username,
    name: session.data.name,
    email: session.data.email,
  };
});

export const Route = createRootRoute({
  meta: () => [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      title: "App",
    },
  ],
  links: () => [
    {
      rel: "stylesheet",
      href: appCss,
    },
  ],
  beforeLoad: async () => {
    const user = await fetchUser();
    return {
      user,
    };
  },
  component: RootComponent,
});

const queryClient = new QueryClient();

function RootComponent() {
  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { user } = Route.useRouteContext();

  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  );
}
