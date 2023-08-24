import { describe, it, beforeEach, expect, beforeAll } from "@jest/globals";
import { NewWorkspace } from "@application/dtos/newWorkspace";
import { Context } from "@infraestructure/controllers/types";
import { register } from "@infraestructure/controllers/authentication/registerController";
import { RegisterFormDto } from "@application/dtos/registerForm";
import { Uuid } from "@domain/types";
import { login } from "@infraestructure/controllers/authentication/loginControllers";
import { createWorkspace } from "@infraestructure/controllers/workspace/createWorkspace";
import { paginateWorkspaceByUserUuid as paginateMyWorkspaces } from "@infraestructure/controllers/workspace/paginateWorkspaceByUserUuid";

describe("PaginateMyWorkspaces Controller", () => {
  let context: Context;

  const registerForm: RegisterFormDto = {
    username: "testerson",
    email: "testerson@gmail.com",
    password: "secret",
  }
  let token: string;
  let userId: Uuid;
  beforeAll(async () => {
    context = {
      hashSalt: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      jwtSecret: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      DbPool: { users: [], workspaces: [] },
    };

    const { id } = await register(registerForm, context) as any;
    expect(id).toBeDefined()
    userId = id
    token = "Bearer " + (await login(registerForm, context)).access
  })

  let workspace: NewWorkspace;
  beforeEach(async () => {
    context.DbPool.workspaces = [];
    workspace = {
      name: "test workspace",
      description: "this is a test description for this Workspace"
    }
  })

  it("should paginate workspaces correctly", async () => {
    const w = { ...workspace };
    const result1 = await createWorkspace(w, token, context)
    w.name = "test workspace 2"
    const result2 = await createWorkspace(w, token, context)
    expect(result1.id).toBeDefined();
    expect(result2.id).toBeDefined();

    const result = await paginateMyWorkspaces(10, 1, token, context);
    expect(result.data).toBeDefined()
    expect(result.data.length).toBe(2)
    expect(result.data.filter((el) => el.id === result1.id)[0]).toBeDefined();
    expect(result.data.filter((el) => el.id === result2.id)[0]).toBeDefined();
  });

  it("should not retrieve another users workspaces", async () => {
    const w = { ...workspace };
    const wsIds = [];
    for (let i = 0; i < 5; i++) {
      w.name = w.name + i;
      const result1 = await createWorkspace(w, token, context)
      wsIds.push(result1.id);
    }

    const registerForm2: RegisterFormDto = {
      username: "testerson2",
      email: "testerson2@gmail.com",
      password: "secret",
    }

    const { id } = await register(registerForm2, context) as any;
    expect(id).toBeDefined()
    const tokenUser2 = "Bearer " + (await login(registerForm2, context)).access
    await createWorkspace({ ...workspace, name: "user2 ws" }, tokenUser2, context)

    const result = await paginateMyWorkspaces(10, 1, token, context);
    expect(result.data.length).toBe(5)
    expect(result.count).toBe(5)
  });


  it("undefined take should be 10", async () => {
    const w = { ...workspace };
    for (let i = 0; i < 11; i++) {
      w.name = w.name + i;
      await createWorkspace(w, token, context)
    }

    const result = await paginateMyWorkspaces(undefined, 1, token, context);
    expect(result.data.length).toBe(10)
    expect(result.count).toBe(11)
  });
});
