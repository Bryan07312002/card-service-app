import { describe, it, expect, beforeEach } from "@jest/globals";
import { faker } from "@faker-js/faker";
import * as request from "supertest";
import { RegisterFormDto } from "@application/dtos/registerForm";
import { API } from "../shared/constants";

describe("REGISTER", () => {
  const path: string = "/register";

  let loginForm: RegisterFormDto;
  beforeEach(() => {
    loginForm = {
      username: "testerson junior",
      email: faker.internet.email(),
      password: faker.string.sample({ min: 6, max: 50 }),
    };
  });

  it("should not register with no email", async () => {
    const form: Partial<RegisterFormDto> = loginForm;
    delete form.email;
    return request
      .agent(API)
      .post(path)
      .send(form)
      .expect(422)
      .then(({ body }) => {
        expect(body.error).toBeDefined();
        expect(body.error.email).toBeDefined();
      });
  });

  it("should not register with no username", async () => {
    const form: Partial<RegisterFormDto> = loginForm;
    delete form.username;
    return request
      .agent(API)
      .post(path)
      .send(form)
      .expect(422)
      .then(({ body }) => {
        expect(body.error).toBeDefined();
        expect(body.error.username).toBeDefined();
      });
  });

  it("should not register with no password", async () => {
    const form: Partial<RegisterFormDto> = loginForm;
    delete form.password;
    return request
      .agent(API)
      .post(path)
      .send(form)
      .expect(422)
      .then(({ body }) => {
        expect(body.error).toBeDefined();
        expect(body.error.password).toBeDefined();
      });
  });

  it("should not register not long enough password", async () => {
    const form: Partial<RegisterFormDto> = loginForm;
    form.password = faker.string.sample({ min: 1, max: 4 });
    return request
      .agent(API)
      .post(path)
      .send(form)
      .expect(422)
      .then(({ body }) => {
        expect(body.error).toBeDefined();
        expect(body.error.password).toBeDefined();
      });
  });

  it("should not register not valid email pattern", async () => {
    const form: Partial<RegisterFormDto> = loginForm;
    form.email = faker.person.firstName();
    return request
      .agent(API)
      .post(path)
      .send(form)
      .expect(422)
      .then(({ body }) => {
        expect(body.error).toBeDefined();
        expect(body.error.email).toBeDefined();
      });
  });

  it("should register new user", async () => {
    const form: Partial<RegisterFormDto> = { ...loginForm };
    return request
      .agent(API)
      .post(path)
      .send(form)
      .expect(201)
      .then(({ body }) => {
        expect(body.username).toBe(form.username);
        expect(body.email).toBe(form.email);
        expect(body.password).not.toBeDefined();
      });
  });
});
