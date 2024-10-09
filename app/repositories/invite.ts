import { db } from "~/database/database";
import { NewInvite, Invite } from "~/database/types";

const table = "invite";

export async function findInviteById(id: number) {
  return await db
    .selectFrom(table)
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

function findInviteQuery(criteria: Partial<Invite>) {
  let query = db
    .selectFrom(table)
    .innerJoin("user as invitee", "invitee.id", "invite.invitee_id")
    .innerJoin("user as inviter", "inviter.id", "invite.inviter_id");

  if (criteria.id) {
    query = query.where("id", "=", criteria.id); // Kysely is immutable, you must re-assign!
  }

  // tobe defined

  return query;
}

export async function findInvite(criteria: Partial<Invite>) {
  let query = findInviteQuery(criteria);
  return await query.selectAll().executeTakeFirst();
}

export async function findInvites(
  criteria: Partial<Invite>,
  limit?: number,
  offset?: number,
) {
  let query = findInviteQuery(criteria);

  if (limit) {
    query = query.limit(limit);
  }

  if (offset) {
    query = query.offset(offset);
  }

  return await query
    .select([
      "invite.id",
      "invite.invitee_id",
      "invite.inviter_id",
      "invite.status",
      "invite.created_at",
      "invitee.name as invitee_name",
      "invitee.username as invitee_username",
      "invitee.email as invitee_email",
      "inviter.name as inviter_name",
      "inviter.username as inviter_username",
      "inviter.email as inviter_email",
    ])
    .execute();
}

export async function createInvite(invite: NewInvite) {
  return await db
    .insertInto(table)
    .values(invite)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteInvite(id: number) {
  return await db.deleteFrom(table).where("id", "=", id).execute();
}
