import { db } from "~/database/database";

export async function findUserById(id: number) {
  return await db
    .selectFrom("user")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}
