import { describe, it, beforeEach, expect, beforeAll } from "@jest/globals";
import { Context } from "@infraestructure/controllers/types";
import { register } from "@infraestructure/controllers/authentication/registerController";
import { RegisterFormDto } from "@application/dtos/registerForm";
import { Uuid } from "@domain/types";
import { login } from "@infraestructure/controllers/authentication/loginControllers";
import { createWorkspace } from "@infraestructure/controllers/workspace/createWorkspace";
import { createTable } from "@infraestructure/controllers/tables/createTable";
import { NewCardDto } from "@application/dtos/NewCard";
import { createCardController } from "@infraestructure/controllers/card/createCard";
import { DomainError } from "@domain/error";

describe("createCard Controller", () => {
  let context: Context;

  const registerForm: RegisterFormDto = {
    username: "testerson",
    email: "testerson@gmail.com",
    password: "secret",
  };
  let token: string;
  let userId: Uuid;
  let tableId: Uuid;
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

    const result = await createWorkspace(
      {
        name: "test workspace",
        description: "this is a test description for this Workspace",
      },
      token,
      context,
    );

    const response = await createTable(
      {
        title: "test table",
        workspaceId: result.id,
      },
      token,
      context,
    );

    tableId = response?.id as Uuid;
  });

  let card: NewCardDto;
  beforeEach(async () => {
    context.DbPool.cards = [];

    card = {
      title: "test Card",
      description: "test description",
      tableId,
    };
  });

  it("should create card correctly", async () => {
    const c = { ...card };
    const response = await createCardController(c, token, context);

    expect(response?.id).toBeDefined();
    expect(response?.title).toBe(c.title);
    expect(response?.tableId).toBe(c.tableId);
  });

  it("should create card with no description", async () => {
    const c: any = { ...card };
    delete c.description;
    const response = await createCardController(c, token, context);

    expect(response?.id).toBeDefined();
    expect(response?.title).toBe(c.title);
    expect(response?.tableId).toBe(c.tableId);
  });

  it("should not create card with no tableId", async () => {
    const c: any = { ...card };
    delete c.tableId;
    try {
      await createCardController(c, token, context);
      throw "should not get here";
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      if (!(e instanceof DomainError)) throw "";
      expect(e.code).toBe(422);
      expect(e.message.errors.tableId).toBeDefined();
    }
  });

  it("should not create card with no title", async () => {
    const c: any = { ...card };
    delete c.title;
    try {
      await createCardController(c, token, context);
      throw "should not get here";
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      if (!(e instanceof DomainError)) throw "";
      expect(e.code).toBe(422);
      expect(e.message.errors.title).toBeDefined();
    }
  });

  it("should not create card with tableId that doesnt exists", async () => {
    const c: any = { ...card };
    c.tableId = "IdDoesNotExists";
    try {
      await createCardController(c, token, context);
      throw "should not get here";
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      if (!(e instanceof DomainError)) throw "";
      expect(e.code).toBe(422);
      expect(e.message.errors.tableId).toBeDefined();
    }
  });
});
