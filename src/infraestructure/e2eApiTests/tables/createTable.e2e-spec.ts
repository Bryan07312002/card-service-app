import { describe, it, expect, beforeEach, beforeAll } from "@jest/globals";
import { faker } from "@faker-js/faker";
import * as request from "supertest";
import { RegisterFormDto } from "@application/dtos/registerForm";
import { API } from "../shared/constants";
import { Uuid } from "@domain/types";
import { NewTable } from "@application/dtos/newTable";

describe("table", () => {
  const path: string = "/tables";

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
      .expect(200)
      .then(({ body }) => {
        expect(body.access).toBeDefined();
        accessToken = body.access;
      });
  });

  let workspaceId: Uuid;
  let table: NewTable;

  beforeEach(async () => {
    await request
      .agent(API)
      .post("/workspace")
      .auth(accessToken, { type: "bearer" })
      .send({
        name: faker.word.sample(),
        description: faker.lorem.text(),
      })
      .expect(201).then(({ body }) => {
        expect(body.id).toBeDefined();
        workspaceId = body.id;
      });

    table = {
      title: faker.word.sample(),
      workspaceId: workspaceId,
    }
  });

  it("should create table correctly", async () => {
    const t = { ...table, title: "card title" };
    return request
      .agent(API)
      .post(path)
      .auth(accessToken, { type: "bearer" })
      .send(t)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined()
        expect(body.title).toBe(t.title)
        expect(body.workspaceId).toBe(t.workspaceId)
      })
  })
});
