import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import queryString from "query-string";
import { findUsers } from "~/repositories/user";
import { useAppSession } from "~/utils/session";

export const Route = createAPIFileRoute("/api/users")({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const params = queryString.parse(url.searchParams.toString()) as {
      page: string;
      per_page: string;
      q: string;
    };

    const page = Number(params.page) || 1;
    const per_page = Number(params.per_page) || 10;

    // convert page and per_page to limit and offset
    const limit = per_page;
    const offset = (page - 1) * per_page;

    // TODO: implement search with q params
    const users = await findUsers({}, limit, offset);

    const session = await useAppSession();

    const data = users
      .filter((user) => user.id != session.data.id)
      .map((user) => ({
        // omit password from response
        ...user,
        password: undefined,
      }));

    return json({ data, page, per_page, total: users.length });
  },
});
