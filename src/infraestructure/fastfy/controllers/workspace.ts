import { FastifyRequest, FastifyReply } from "fastify";
import { Context, Controller } from "../types";
import { CreateWorkspaceUsecase } from "@application/usecases/worspace/createWorkspace";
import { UuidRepository } from "@infraestructure/repositories/uuid/UuidRepository";
import { JsonWebTokenJWTRepository } from "@infraestructure/repositories/jsonWebToken/JsonWebTokenRepository";
import { WorkspaceRepositoryInMemory } from "@infraestructure/repositories/inMemory/WorkspaceRepositoryInMemory";
import { NewWorkspace } from "@application/dtos/newWorkspace";
import { CatchDomainError } from "../error/catchDomainError";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";

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

      return res.send().status(204);
    }
  } catch (e) {
    if (CatchDomainError.isDomainError(e)) {
      return new CatchDomainError(e).toFasfyReply(res);
    }

    res.send("InternalServerError").code(500);
  }
}

export const WORKSPACE_CONTROLLERS: Controller[] = [
  {
    path: "/workspace",
    handler: createWorkspace,
    defaultCode: 201,
    method: "post",
  },
];
