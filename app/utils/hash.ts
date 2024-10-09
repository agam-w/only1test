import crypto from "node:crypto";

export function hashPassword(password: string) {
  const genHash = crypto
    .pbkdf2Sync(password, "salt", 10000, 64, "sha256")
    .toString("hex");
  return genHash;
}

export function verifyPassword(password: string, hash: string) {
  const checkHash = crypto
    .pbkdf2Sync(password, "salt", 10000, 64, "sha256")
    .toString("hex");
  return hash === checkHash;
}
