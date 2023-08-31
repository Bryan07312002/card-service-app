import { LoginFormDto } from "@application/dtos/login";
import { describe, it, beforeEach } from "@jest/globals";
import { faker } from "@faker-js/faker";
import * as request from "supertest";
import { API } from "../shared/constants";

describe("LOGIN", () => {
  const path: string = "/login";
  let loginForm: LoginFormDto = {
    email: "",
    password: "",
  };

  beforeEach(() => {
    loginForm = {
      email: "",
      password: "",
    };
  });

  it("should not auth with no email", async () => {
    const form: Partial<LoginFormDto> = loginForm;
    delete form.email;
    return request.agent(API).post(path).send(form).expect(422);
  });

  it("should not auth with no password", async () => {
    const form: Partial<LoginFormDto> = loginForm;
    delete form.password;
    return request.agent(API).post(path).send(form).expect(422);
  });

  it("should not authenticate with no existent user", () => {
    loginForm.email = faker.string.sample({ min: 3, max: 50 });
    loginForm.password = faker.string.sample({ min: 3, max: 50 });
    return request.agent(API).post(path).send(loginForm).expect(422);
  });

  it("should auth with existing user", () => {});
});
