import { describe, expect, beforeAll } from "@jest/globals";
import { faker } from "@faker-js/faker";
import * as request from "supertest";
import { RegisterFormDto } from "@application/dtos/registerForm";
import { API } from "../shared/constants";

describe("cards", () => {
  const path: string = "/cards";

  let accessToken: string;
  let loginForm: RegisterFormDto;
  beforeAll(async () => {
    loginForm = {
      username: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.sample({ min: 6, max: 50 }),
    };

    await request.agent(API).post("/register").send(loginForm);

    await request
      .agent(API)
      .post("/login")
      .send(loginForm)
      .then(({ body }) => {
        expect(body.access).toBeDefined();
        accessToken = body.access;
      });
  });
});
