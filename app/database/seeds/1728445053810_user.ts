import type { Kysely } from "kysely";
import { createUser, findUser } from "~/repositories/user";
import { NewUser } from "../types";
import { hashPassword } from "~/utils/hash";
import { createFakeUsers } from "~/utils/faker";

export async function seed(db: Kysely<any>): Promise<void> {
  const password = hashPassword("123456");

  const users: NewUser[] = [
    {
      username: "user1",
      name: "User1",
      email: "user1@example.com",
      password,
      verified: true,
    },
    {
      username: "user2",
      name: "User2",
      email: "user2@example.com",
      password,
      verified: true,
    },
    {
      username: "user3",
      name: "User3",
      email: "user3@example.com",
      password,
      verified: true,
    },
  ];

  const fakeUsers = createFakeUsers(100).map((user) => ({
    ...user,
    password,
  }));

  const usersToCreate = [...users, ...fakeUsers];

  for (const user of usersToCreate) {
    const userExists = await findUser({ username: user.username });
    if (!userExists) {
      await createUser(user);
    }
  }
}
