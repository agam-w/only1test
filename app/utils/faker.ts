import { faker } from "@faker-js/faker";

export function createFakeUser() {
  return {
    username: faker.internet.userName(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    verified: faker.datatype.boolean(),
  };
}

export function createFakeUsers(count: number) {
  return Array.from({ length: count }, () => createFakeUser());
}
