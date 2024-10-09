import { db } from "~/database/database";
import { NewPermission, Permission } from "~/database/types";

const table = "permission";

export async function findPermissionById(id: number) {
  return await db
    .selectFrom(table)
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

function findPermissionQuery(criteria: Partial<Permission>) {
  let query = db.selectFrom(table);

  if (criteria.id) {
    query = query.where("id", "=", criteria.id); // Kysely is immutable, you must re-assign!
  }

  // tobe defined

  return query;
}

export async function findInvite(criteria: Partial<Permission>) {
  let query = findPermissionQuery(criteria);
  return await query.selectAll().executeTakeFirst();
}

export async function findInvites(
  criteria: Partial<Permission>,
  limit?: number,
  offset?: number,
) {
  let query = findPermissionQuery(criteria);

  if (limit) {
    query = query.limit(limit);
  }

  if (offset) {
    query = query.offset(offset);
  }

  return await query.selectAll().execute();
}

export async function createPermission(invite: NewPermission) {
  return await db
    .insertInto(table)
    .values(invite)
    .returningAll()
    .executeTakeFirstOrThrow();
}
