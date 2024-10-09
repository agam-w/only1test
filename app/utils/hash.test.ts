import { describe, expect, test } from "vitest";
import { hashPassword, verifyPassword } from "./hash";

describe("verifyPassword", () => {
  test("should return true if the password and hash match", () => {
    const password = "123456";
    const hash = hashPassword(password);
    const result = verifyPassword(password, hash);
    expect(result).toBe(true);
  });

  test("should return false if the password and hash do not match", () => {
    const password = "123456";
    const hash = hashPassword(password);
    const result = verifyPassword("12345678", hash);
    expect(result).toBe(false);
  });
});
