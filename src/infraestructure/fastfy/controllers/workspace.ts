import { FastifyRequest, FastifyReply } from "fastify";
import { Context, Controller } from "../types";
import { JsonWebTokenJWTRepository } from "@infraestructure/repositories/jsonWebToken/JsonWebTokenRepository";
import { WorkspaceRepositoryInMemory } from "@infraestructure/repositories/inMemory/WorkspaceRepositoryInMemory";
import { CatchDomainError } from "../error/catchDomainError";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";
import { DeleteWorkspaceById } from "@application/usecases/worspace/deleteWorkspace";
import { isUuid } from "@application/usecases/shared/utilsValidators";
import { GetFullWorkspaceByUuid } from "@application/usecases/worspace/getFullTableById";
import { TableRepositoryInMemory } from "@infraestructure/repositories/inMemory/TableRepositoryInMemory";
import { CardRepositoryInMemory } from "@infraestructure/repositories/inMemory/CardRepositoryInMemory";
import { createWorkspace as createWorkspaceController } from "@infraestructure/controllers/workspace/createWorkspace";
import { paginateWorkspaceByUserUuid as paginateWorkspaceByUserUuidController } from "@infraestructure/controllers/workspace/paginateWorkspaceByUserUuid";

async function createWorkspace(
  req: FastifyRequest,
  res: FastifyReply,
  context: Context,
) {
  return res
    .code(201)
    .send(
      await createWorkspaceController(
        req.body,
        req.headers.authorization?.slice(7) ?? "",
        context
      )
    );
}

async function deleteWorkspaceById(
  req: FastifyRequest,
  res: FastifyReply,
  context: Context,
): Promise<FastifyReply> {
  const jwt = new JsonWebTokenJWTRepository(context.jwtSecret);
  const workspace = new WorkspaceRepositoryInMemory(context.DbPool.workspaces);
  const user = new UserRepositoryInMemory(context.DbPool.users);

  try {
    const id = ((req.params as any).id as string) ?? undefined;
    if (!isUuid(id)) return res.send().code(204);

    (
      await new DeleteWorkspaceById(workspace, jwt, user).authenticate(
        req.headers.authorization?.slice(7) ?? "",
      )
    ).execute(id);

    return res.send().code(204);
  } catch (e) {
    if (CatchDomainError.isDomainError(e)) {
      return new CatchDomainError(e).toFasfyReply(res);
    }

    return res.send("InternalServerError").code(500);
  }
}

async function paginateWorkspaceByUserUuid(
  req: FastifyRequest,
  res: FastifyReply,
  context: Context,
): Promise<FastifyReply> {
  return res
    .code(200)
    .send(
      await paginateWorkspaceByUserUuidController(
        (req.query as any).take,
        (req.query as any).take,
        req.headers.authorization,
        context
      )
    );
}

async function getFullWorkspace(
  req: FastifyRequest,
  res: FastifyReply,
  context: Context,
) {
  const jwt = new JsonWebTokenJWTRepository(context.jwtSecret);
  const workspace = new WorkspaceRepositoryInMemory(context.DbPool.workspaces);
  const user = new UserRepositoryInMemory(context.DbPool.users);
  const table = new TableRepositoryInMemory(context.DbPool.tables);
  const card = new CardRepositoryInMemory(context.DbPool.cards);
  const usecase = new GetFullWorkspaceByUuid(workspace, table, card, user, jwt);

  try {
    const id = ((req.params as any).id as string) ?? undefined;
    if (!isUuid(id)) return;

    await usecase.authenticate(req.headers.authorization?.slice(7) ?? "")
    const fullWs = await usecase.execute(id);
    const json: any = {
      name: fullWs.name,
      description: fullWs.description,
      tables: fullWs.tables.map(el => {
        const jsonCards = el.cards.map(c => {
          const card: any = c.toJson();
          delete card.tableId;
        })
        const jsonTable: any = el.toJson();

        return {
          id: jsonTable.id,
          title: json.title,
          cards: jsonCards,
        }
      })
    }
    return res.code(200).send()
  } catch (e) {
    if (CatchDomainError.isDomainError(e)) {
      return new CatchDomainError(e).toFasfyReply(res);
    }

    return res.send("InternalServerError").code(500);
  }
}

export const WORKSPACE_CONTROLLERS: Controller[] = [
  {
    path: "/workspace",
    handler: createWorkspace,
    defaultCode: 201,
    method: "post",
  },
  {
    path: "/workspace/:id",
    handler: createWorkspace,
    defaultCode: 204,
    method: "delete",
  },
  {
    path: "/workspace",
    handler: paginateWorkspaceByUserUuid,
    defaultCode: 200,
    method: "get",
  },
];
