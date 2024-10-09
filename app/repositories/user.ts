import { db } from "~/database/database";
import { NewUser, User } from "~/database/types";

const table = "user";

export async function findUserById(id: number) {
  return await db
    .selectFrom(table)
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

function findUserQuery(criteria: Partial<User>) {
  let query = db.selectFrom(table);

  if (criteria.id) {
    query = query.where("id", "=", criteria.id); // Kysely is immutable, you must re-assign!
  }

  if (criteria.username) {
    query = query.where("username", "=", criteria.username);
  }

  if (criteria.email) {
    query = query.where("email", "=", criteria.email);
  }

  if (criteria.verified) {
    query = query.where("verified", "=", criteria.verified);
  }

  return query;
}

export async function findUser(criteria: Partial<User>) {
  let query = findUserQuery(criteria);
  return await query.selectAll().executeTakeFirst();
}

export async function findUsers(
  criteria: Partial<User>,
  limit?: number,
  offset?: number,
) {
  let query = findUserQuery(criteria);

  if (limit) {
    query = query.limit(limit);
  }

  if (offset) {
    query = query.offset(offset);
  }

  return await query.selectAll().execute();
}

export async function createUser(user: NewUser) {
  return await db
    .insertInto(table)
    .values(user)
    .returningAll()
    .executeTakeFirstOrThrow();
}
