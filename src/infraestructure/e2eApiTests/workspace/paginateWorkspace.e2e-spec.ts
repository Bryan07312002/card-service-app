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

  it("should recive at least one workspace", async () => {
    await request
      .agent(API)
      .post(path)
      .auth(accessToken, { type: "bearer" })
      .send(workspace)
      .expect(204);

    return request
      .agent(API)
      .get(path)
      .auth(accessToken, { type: "bearer" })
      .expect(200)
      .then(({ body }) => {
        expect(body.data).toBeDefined();
        expect(body.count).toBeDefined();
        expect(body.page).toBeDefined();

        for (const i in body.data) {
          expect(body.data[i].id).toBeDefined();
          expect(body.data[i].name).toBeDefined();
          expect(body.data[i].description).toBeDefined();
        }
      });
  });
});
