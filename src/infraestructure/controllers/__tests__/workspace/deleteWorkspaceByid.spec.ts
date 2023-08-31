import { describe, it, expect, beforeAll } from "@jest/globals";
import { Context } from "@infraestructure/controllers/types";
import { register } from "@infraestructure/controllers/authentication/registerController";
import { RegisterFormDto } from "@application/dtos/registerForm";
import { Uuid } from "@domain/types";
import { login } from "@infraestructure/controllers/authentication/loginControllers";
import { createWorkspace } from "@infraestructure/controllers/workspace/createWorkspace";
import { deleteWorkspaceByIdController } from "@infraestructure/controllers/workspace/deleteWorkspaceController";

describe("deleteWorkspaceById Controller", () => {
  let context: Context;

  const registerForm: RegisterFormDto = {
    username: "testerson",
    email: "testerson@gmail.com",
    password: "secret",
  };
  let token: string;
  let userId: Uuid;
  let workspaceId: Uuid;
  beforeAll(async () => {
    context = {
      hashSalt: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      jwtSecret: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      DbPool: { users: [], workspaces: [], tables: [], cards: [] },
    };

    const { id } = (await register(registerForm, context)) as any;
    expect(id).toBeDefined();
    userId = id;
    token = "Bearer " + (await login(registerForm, context)).access;

    const WorkspaceResult = await createWorkspace(
      {
        name: "test workspace",
        description: "this is a test description for this Workspace",
      },
      token,
      context,
    );

    workspaceId = WorkspaceResult.id;
  });

  it("should delete workspace correctly", async () => {
    const fullWs = await deleteWorkspaceByIdController(
      workspaceId,
      token,
      context,
    );
    expect(fullWs).not.toBeDefined();
    expect(
      context.DbPool.workspaces.find((el: any) => el.id === workspaceId),
    ).not.toBeDefined();
  });
});
