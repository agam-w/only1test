import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("invite")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("invitee_id", "serial", (col) => col.notNull())
    .addColumn("inviter_id", "serial", (col) => col.notNull())
    .addColumn("status", "varchar", (col) => col.notNull().defaultTo("pending"))
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await db.schema
    .createTable("pemission")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("invite_id", "serial", (col) => col.notNull())
    .addColumn("user_id", "serial", (col) => col.notNull())
    .addColumn("permission", "varchar")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("pemission").execute();
  await db.schema.dropTable("invite").execute();
}
