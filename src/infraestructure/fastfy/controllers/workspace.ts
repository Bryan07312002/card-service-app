import { FastifyRequest, FastifyReply } from "fastify";
import { Context, Controller } from "../types";
import { JsonWebTokenJWTRepository } from "@infraestructure/repositories/jsonWebToken/JsonWebTokenRepository";
import { WorkspaceRepositoryInMemory } from "@infraestructure/repositories/inMemory/WorkspaceRepositoryInMemory";
import { CatchDomainError } from "../error/catchDomainError";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";
import { DeleteWorkspaceById } from "@application/usecases/worspace/deleteWorkspace";
import { isUuid } from "@application/usecases/shared/utilsValidators";
import { createWorkspace as createWorkspaceController } from "@infraestructure/controllers/workspace/createWorkspace";
import { paginateWorkspaceByUserUuid as paginateWorkspaceByUserUuidController } from "@infraestructure/controllers/workspace/paginateWorkspaceByUserUuid";
import { getFullWorkspaceByUuid } from "@infraestructure/controllers/workspace/getFullWorkspaceByUuid";

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
  return res
    .code(200)
    .send(
      await getFullWorkspaceByUuid((req.params as any).id,
        req.headers.authorization,
        context
      )
    );
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
    handler: getFullWorkspace,
    defaultCode: 200,
    method: "get",
  },
  {
    path: "/workspace",
    handler: paginateWorkspaceByUserUuid,
    defaultCode: 200,
    method: "get",
  },
];
