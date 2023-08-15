import { describe, it, expect, beforeEach, beforeAll } from "@jest/globals";
import { faker } from "@faker-js/faker";
import * as request from "supertest";
import { RegisterFormDto } from "@application/dtos/registerForm";
import { NewCardDto } from "@application/dtos/NewCard";
import { API } from "../shared/constants";

describe("workspace", () => {
  const path: string = "/workspace";

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

  let workspace: NewCardDto;
  beforeEach(() => {
    workspace = {
      title: faker.lorem.words(),
      description: faker.lorem.text(),
    };
  });

  it("should create new workspace", async () => {
    return request
      .agent(API)
      .post(path)
      .auth(accessToken, { type: "bearer" })
      .send(workspace)
      .expect(204);
  });

  it("should not create workspace with no title", async () => {
    let form: Partial<newWS> = { ...workspace };
    delete form.name;

    return request
      .agent(API)
      .post(path)
      .auth(accessToken, { type: "bearer" })
      .send(form)
      .expect(422)
      .then(({ body }) => {
        expect(body.error).toBeDefined();
        expect(body.error.name).toBeDefined();
      });
  });

  it("should create workspace with no description", async () => {
    let form: Partial<newWS> = { ...workspace };
    delete form.description;

    return request
      .agent(API)
      .post(path)
      .auth(accessToken, { type: "bearer" })
      .send(form)
      .expect(204);
  });
});
