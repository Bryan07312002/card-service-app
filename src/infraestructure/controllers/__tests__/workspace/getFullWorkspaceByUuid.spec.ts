import { describe, it, expect, beforeAll } from "@jest/globals";
import { Context } from "@infraestructure/controllers/types";
import { register } from "@infraestructure/controllers/authentication/registerController";
import { RegisterFormDto } from "@application/dtos/registerForm";
import { Uuid } from "@domain/types";
import { login } from "@infraestructure/controllers/authentication/loginControllers";
import { createWorkspace } from "@infraestructure/controllers/workspace/createWorkspace";
import { createTable } from "@infraestructure/controllers/tables/createTable";
import { createCardController } from "@infraestructure/controllers/card/createCard";
import { getFullWorkspaceByUuid } from "@infraestructure/controllers/workspace/getFullWorkspaceByUuid";

describe("getFullWorkspaceByUuid Controller", () => {
  let context: Context;

  const registerForm: RegisterFormDto = {
    username: "testerson",
    email: "testerson@gmail.com",
    password: "secret",
  }
  let token: string;
  let userId: Uuid;
  let workspaceId: Uuid;
  let tableId: Uuid;
  let cardId: Uuid;
  beforeAll(async () => {
    context = {
      hashSalt: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      jwtSecret: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      DbPool: { users: [], workspaces: [], tables: [], cards: [] },
    };

    const { id } = await register(registerForm, context) as any;
    expect(id).toBeDefined()
    userId = id
    token = "Bearer " + (await login(registerForm, context)).access

    const WorkspaceResult = await createWorkspace({
      name: "test workspace",
      description: "this is a test description for this Workspace",
    }, token, context)

    workspaceId = WorkspaceResult.id;

    const response = await createTable({
      title: "test table",
      workspaceId: WorkspaceResult.id,
    }, token, context);

    tableId = response?.id as Uuid;

    const cardResult = await createCardController(
      {
        title: "test Card",
        description: "test description",
        tableId,
      },
      token,
      context
    );
    cardId = cardResult.id as Uuid;
  })

  it("should get full workspace correctly", async () => {
    const fullWs = await getFullWorkspaceByUuid(workspaceId, token, context);

    expect(fullWs.tables.find((el) => el.id == tableId)).toBeDefined()
  });
});

