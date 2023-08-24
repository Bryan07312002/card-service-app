import { describe, it, beforeEach, expect, beforeAll } from "@jest/globals";
import { register } from "@infraestructure/controllers/authentication/registerController";
import { Context } from "@infraestructure/controllers/types";
import { DomainError } from "@domain/error";
import { RegisterFormDto } from "@application/dtos/registerForm";

describe("Register Controller", () => {
  let context: Context;
  let registerForm: RegisterFormDto;
  beforeEach(() => {
    context = {
      hashSalt: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      jwtSecret: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      DbPool: { users: [] },
    };

    registerForm = {
      email: "testeasdas@email.com",
      username: "teste",
      password: "secret",
    }
  })

  it("should not register user that has nothing", async () => {
    try {
      await register({}, context);
      throw "should not get here"
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      if (!(e instanceof DomainError)) { throw "e is not instance of DomainError" }

      expect(e.code).toBe(422);
    }
  })

  it("should not register user that has no username", async () => {
    let form: any = { ...registerForm };
    delete form.username;
    try {
      await register(form, context);
      throw "should not get here"
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      if (!(e instanceof DomainError)) { throw "e is not instance of DomainError" }

      expect(e.code).toBe(422);
      expect(e.message.errors.username).toBeDefined();
    }
  })

  it("should not register user that has no password", async () => {
    let form: any = { ...registerForm };
    delete form.password;
    try {
      await register(form, context);
      throw "should not get here"
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      if (!(e instanceof DomainError)) { throw "e is not instance of DomainError" }

      expect(e.code).toBe(422);
      expect(e.message.errors.password).toBeDefined();
    }
  })

  it("should not register user that has no email", async () => {
    let form: any = { ...registerForm };
    delete form.email;
    try {
      await register(form, context);
      throw "should not get here"
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      if (!(e instanceof DomainError)) { throw "e is not instance of DomainError" }

      expect(e.code).toBe(422);
      expect(e.message.errors.email).toBeDefined();
    }
  })

  it("should not register user that has no email", async () => {
    let form: any = { ...registerForm };
    form.email = 'AnInvalidEmail';
    try {
      await register(form, context);
      throw "should not get here"
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      if (!(e instanceof DomainError)) { throw "e is not instance of DomainError" }

      expect(e.code).toBe(422);
      expect(e.message.errors.email).toBeDefined();
    }
  })
});
