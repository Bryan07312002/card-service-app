import { describe, expect, it, beforeEach } from "@jest/globals";
import { User } from "../user";
import { DomainError } from "@domain/error";

describe("User class tests", () => {
  let user: User;

  beforeEach(() => {
    // Create a new User instance before each test
    user = new User(
      "a-a-a-a-a", // You need to provide a valid Uuid instance here
      "johndoe",
      "john@example.com",
      "secure123",
    );
  });

  it("should set valid username", () => {
    user.username = "newusername";
    expect(user.username).toBe("newusername");
  });

  it("should throw error for invalid username", () => {
    let err = undefined;
    try {
      user.username = "ab"; // Invalid username
    } catch (e) {
      err = e;
    }
    expect(err).toEqual(
      new DomainError(
        { errors: { username: "Username must be between 3 and 20 characters." } },
        422,
      ),
    );
  });

  it("should set valid email", () => {
    user.email = "new@example.com";
    expect(user.email).toBe("new@example.com");
  });

  it("should throw error for invalid email", () => {
    let err = undefined;
    try {
      user.email = "invalid-email"; // Invalid email
    } catch (e) {
      err = e;
    }
    expect(err).toEqual(
      new DomainError({ errors: { email: "Invalid email format." } }, 422),
    );
  });

  it("should set valid password", () => {
    user.password = "newpassword";
    expect(user.matchPassword("newpassword")).toBeTruthy();
  });

  it("should throw error for invalid password", () => {
    let err = undefined;
    try {
      user.password = "abc"; // Invalid password
    } catch (e) {
      err = e;
    }
    expect(err).toEqual(
      new DomainError(
        { errors: { password: "Password must be at least 5 characters." } },
        422,
      ),
    );
  });

  it("should match correct password", () => {
    expect(user.matchPassword("secure123")).toBeTruthy();
  });

  it("should not match incorrect password", () => {
    expect(user.matchPassword("wrongpassword")).toBeFalsy();
  });

  it("should serialize user to JSON", () => {
    const serialized = user.toJson();
    expect(serialized).toEqual({
      email: "john@example.com",
      username: "johndoe",
      id: user.id,
    });
  });
});
