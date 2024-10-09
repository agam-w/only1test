export type AvailablePermission =
  | "posts_read"
  | "posts_write"
  | "messages_read"
  | "messages_write"
  | "profile_read"
  | "profile_write";

export const availablePermissions: AvailablePermission[] = [
  "posts_read",
  "posts_write",
  "messages_read",
  "messages_write",
  "profile_read",
  "profile_write",
];
