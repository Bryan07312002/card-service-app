import { describe, it, beforeEach, expect, beforeAll } from "@jest/globals";
import { NewWorkspace } from "@application/dtos/newWorkspace";
import { Context } from "@infraestructure/controllers/types";
import { register } from "@infraestructure/controllers/authentication/registerController";
import { RegisterFormDto } from "@application/dtos/registerForm";
import { Uuid } from "@domain/types";
import { login } from "@infraestructure/controllers/authentication/loginControllers";
import { createWorkspace } from "@infraestructure/controllers/workspace/createWorkspace";
import { DomainError } from "@domain/error";

describe("Create Workspace Controller", () => {
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

  it("should create workspace correctly", async () => {
    const w = { ...workspace };
    const result = await createWorkspace(w, token, context)

    expect(result.id).toBeDefined();
    expect(result.userId).toBe(userId);
    expect(result.name).toBe(w.name);
    expect(result.description).toBe(w.description);
  });

  it("should create workspace correctly with no description", async () => {
    const w: any = { ...workspace };
    delete w.description;
    const result = await createWorkspace(w, token, context)

    expect(result.id).toBeDefined();
    expect(result.userId).toBe(userId);
    expect(result.name).toBe(w.name);
    expect(result.description).toBe("");
  });

  it("should not create workspace with no name", async () => {
    const w: any = { ...workspace };
    delete w.name;
    try {
      await createWorkspace(w, token, context)
      throw "shouldn't get here"
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      if (!(e instanceof DomainError)) return;
      expect(e.code).toBe(422);
      expect(e.message.errors.name).toBeDefined();
    }
  });
});
