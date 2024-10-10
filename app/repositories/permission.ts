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

export async function findPermission(criteria: Partial<Permission>) {
  let query = findPermissionQuery(criteria);
  return await query.selectAll().executeTakeFirst();
}

export async function findPermissions(
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

export async function createPermission(
  invite: NewPermission | NewPermission[],
) {
  return await db
    .insertInto(table)
    .values(invite)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteAllPermissionsByInviteId(invite_id: number) {
  return await db
    .deleteFrom(table)
    .where("invite_id", "=", invite_id)
    .execute();
}
