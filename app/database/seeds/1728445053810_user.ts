import type { Kysely } from "kysely";
import { createUser, findUsers } from "~/repositories/user";
import { NewUser } from "../types";
import { hashPassword } from "~/utils/hash";

export async function seed(db: Kysely<any>): Promise<void> {
  const users: NewUser[] = [
    {
      username: "user1",
      email: "user1@example.com",
      password: hashPassword("123456"),
      name: "User1",
      verified: true,
    },
    {
      username: "user2",
      email: "user2@example.com",
      password: hashPassword("123456"),
      name: "User2",
      verified: false,
    },
    {
      username: "user3",
      email: "user3@example.com",
      password: hashPassword("123456"),
      name: "User3",
      verified: false,
    },
  ];

  for (const user of users) {
    const searchUsers = await findUsers({ username: user.username });
    const userExists = searchUsers.length > 0;
    if (!userExists) {
      await createUser(user);
    }
  }
}
