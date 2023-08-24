import { describe, it, beforeEach, expect } from "@jest/globals";
import { login } from "@infraestructure/controllers/authentication/loginControllers";
import { Context } from "@infraestructure/controllers/types";
import { DomainError } from "@domain/error";
import { faker } from "@faker-js/faker";

describe("Login Controller", () => {
  let context: Context;
  beforeEach(() => {
    context = {
      hashSalt: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      jwtSecret: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      DbPool: { users: [] },
    };
  })

  it("should recive 401 if user does not exists", async () => {
    try {
      await login({
        email: faker.internet.email(),
        password: faker.internet.password(),
      }, context);
      throw "should not get here"
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      if (!(e instanceof DomainError)) { throw "e is not instance of DomainError" }

      expect(e.code).toBe(401);
    }
  });

  it("should recive 422 if nothing is given", async () => {
    try {
      await login({}, context);
      throw "should not get here"
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      if (!(e instanceof DomainError)) { throw "e is not instance of DomainError" }

      expect(e.code).toBe(422);
    }
  });

  it("should recive 422 if email is not given", async () => {
    try {
      await login({ password: "secret" }, context);
      throw "should not get here"
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      if (!(e instanceof DomainError)) { throw "e is not instance of DomainError" }

      expect(e.code).toBe(422);
      expect(e.message.errors.email).toBeDefined();
    }
  });
});
