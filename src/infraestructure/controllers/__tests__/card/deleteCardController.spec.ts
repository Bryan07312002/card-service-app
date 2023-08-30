import { describe, test, beforeEach, expect, beforeAll } from "@jest/globals";
import { Context } from "@infraestructure/controllers/types";
import { register } from "@infraestructure/controllers/authentication/registerController";
import { RegisterFormDto } from "@application/dtos/registerForm";
import { Uuid } from "@domain/types";
import { login } from "@infraestructure/controllers/authentication/loginControllers";
import { createWorkspace } from "@infraestructure/controllers/workspace/createWorkspace";
import { createTable } from "@infraestructure/controllers/tables/createTable";
import { NewCardDto } from "@application/dtos/NewCard";
import { createCardController } from "@infraestructure/controllers/card/createCard";
import { deleteCardController } from "@infraestructure/controllers/card/deleteCardController";

describe("deleteCardController Controller", () => {
  let context: Context;

  const registerForm: RegisterFormDto = {
    username: "testerson",
    email: "testerson@gmail.com",
    password: "secret",
  }
  let token: string;
  let userId: Uuid;
  let tableId: Uuid;
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

    const result = await createWorkspace({
      name: "test workspace",
      description: "this is a test description for this Workspace",
    }, token, context)

    const response = await createTable({
      title: "test table",
      workspaceId: result.id,
    }, token, context);

    tableId = response?.id as Uuid;
  })

  let cardId: Uuid;
  beforeEach(async () => {
    context.DbPool.cards = [];
    const card: NewCardDto = {
      title: "test Card",
      description: "test description",
      tableId,
    }

    const { id } = await createCardController(card, token, context);
    cardId = id as Uuid;
  })

  test("response shouldn´t be defined", async () => {
    const response = await deleteCardController(cardId, token, context);
    expect(response).not.toBeDefined();
  });
});

