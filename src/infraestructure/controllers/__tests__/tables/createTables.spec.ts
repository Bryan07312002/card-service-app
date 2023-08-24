import { describe, it, beforeEach, expect, beforeAll } from "@jest/globals";
import { Context } from "@infraestructure/controllers/types";
import { register } from "@infraestructure/controllers/authentication/registerController";
import { RegisterFormDto } from "@application/dtos/registerForm";
import { Uuid } from "@domain/types";
import { login } from "@infraestructure/controllers/authentication/loginControllers";
import { createWorkspace } from "@infraestructure/controllers/workspace/createWorkspace";
import { NewTable } from "@application/dtos/newTable";
import { createTable } from "@infraestructure/controllers/tables/createTable";

describe("createTable Controller", () => {
  let context: Context;

  const registerForm: RegisterFormDto = {
    username: "testerson",
    email: "testerson@gmail.com",
    password: "secret",
  }
  let token: string;
  let userId: Uuid;
  let workspaceId: Uuid;
  beforeAll(async () => {
    context = {
      hashSalt: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      jwtSecret: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      DbPool: { users: [], workspaces: [], tables: [] },
    };

    const { id } = await register(registerForm, context) as any;
    expect(id).toBeDefined()
    userId = id
    token = "Bearer " + (await login(registerForm, context)).access

    const result = await createWorkspace({
      name: "test workspace",
      description: "this is a test description for this Workspace",
    }, token, context)

    workspaceId = result.id
  })


  let table: NewTable;
  beforeEach(async () => {
    context.DbPool.tables = [];

    table = {
      title: "test table",
      workspaceId: workspaceId
    }
  })

  it("should create table correctly", async () => {
    const t = { ...table };
    const response = await createTable(t, token, context);

    expect(response?.id).toBeDefined();
    expect(response?.title).toBe(t.title);
    expect(response?.workspaceId).toBe(t.workspaceId);
  });
});
