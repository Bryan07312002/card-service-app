import { FastifyRequest, FastifyReply } from "fastify";
import { Context, Controller } from "../types";
import { CreateWorkspaceUsecase } from "@application/usecases/worspace/createWorkspace";
import { UuidRepository } from "@infraestructure/repositories/uuid/UuidRepository";
import { JsonWebTokenJWTRepository } from "@infraestructure/repositories/jsonWebToken/JsonWebTokenRepository";
import { WorkspaceRepositoryInMemory } from "@infraestructure/repositories/inMemory/WorkspaceRepositoryInMemory";
import { NewWorkspace } from "@application/dtos/newWorkspace";
import { CatchDomainError } from "../error/catchDomainError";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";
import { DeleteWorkspaceById } from "@application/usecases/worspace/deleteWorkspace";
import { isUuid } from "@application/usecases/shared/utilsValidators";
import { PaginateWorkspacesByUserUuid } from "@application/usecases/worspace/paginateWorkspace";

async function createWorkspace(
  req: FastifyRequest,
  res: FastifyReply,
  context: Context,
) {
  const uuid = new UuidRepository();
  const jwt = new JsonWebTokenJWTRepository(context.jwtSecret);
  const workspace = new WorkspaceRepositoryInMemory(context.DbPool.workspaces);
  const user = new UserRepositoryInMemory(context.DbPool.users);
  try {
    const body = req.body;
    if (NewWorkspace.isNewWorkspace(body)) {
      (
        await new CreateWorkspaceUsecase(
          workspace,
          jwt,
          uuid,
          user,
        ).authenticate(req.headers.authorization?.slice(7) ?? "")
      ).execute(body);

      return res.code(204).send();
    }
  } catch (e) {
    if (CatchDomainError.isDomainError(e)) {
      return new CatchDomainError(e).toFasfyReply(res);
    }

    res.send("InternalServerError").code(500);
  }
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
  const jwt = new JsonWebTokenJWTRepository(context.jwtSecret);
  const workspace = new WorkspaceRepositoryInMemory(context.DbPool.workspaces);
  const user = new UserRepositoryInMemory(context.DbPool.users);

  try {
    const take = ((req.query as any).take as number) ?? 10;
    const page = ((req.query as any).take as number) ?? 1;

    if (isNaN(take)) return res.send().code(400);
    if (isNaN(page)) return res.send().code(400);

    const worksapaces = await (
      await new PaginateWorkspacesByUserUuid(workspace, jwt, user).authenticate(
        req.headers.authorization?.slice(7) ?? "",
      )
    ).execute({ take, page });

    return res.send(worksapaces).code(200);
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
