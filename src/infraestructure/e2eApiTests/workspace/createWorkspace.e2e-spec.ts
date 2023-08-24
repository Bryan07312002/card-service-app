import { describe, it, expect, beforeEach, beforeAll } from "@jest/globals";
import { faker } from "@faker-js/faker";
import * as request from "supertest";
import { RegisterFormDto } from "@application/dtos/registerForm";
import { NewWorkspace } from "@application/dtos/newWorkspace";
import { API } from "../shared/constants";

type newWS = NewWorkspace & {
  userId?: string;
};

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

  let workspace: any;
  beforeEach(() => {
    workspace = {
      name: faker.word.sample(),
      description: faker.lorem.text(),
    };
  });

  it("should create new workspace", async () => {
    let form: Partial<newWS> = { ...workspace, name: "workspace" };
    return request
      .agent(API)
      .post(path)
      .auth(accessToken, { type: "bearer" })
      .send(form)
      .expect(201);
  });

  it("should create workspace with no description", async () => {
    let form: Partial<newWS> = { ...workspace, name: "workspace with no description" };
    delete form.description;

    return request
      .agent(API)
      .post(path)
      .auth(accessToken, { type: "bearer" })
      .send(form)
      .expect(201)
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

});
