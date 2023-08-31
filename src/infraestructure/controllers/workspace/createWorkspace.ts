import { NewWorkspace } from "@application/dtos/newWorkspace";
import { CreateWorkspaceUsecase } from "@application/usecases/worspace/createWorkspace";
import { Context } from "@infraestructure/controllers/types";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";
import { WorkspaceRepositoryInMemory } from "@infraestructure/repositories/inMemory/WorkspaceRepositoryInMemory";
import { JsonWebTokenJWTRepository } from "@infraestructure/repositories/jsonWebToken/JsonWebTokenRepository";
import { UuidRepository } from "@infraestructure/repositories/uuid/UuidRepository";
import { isJwtToken } from "../shared/isJwtToken";
import { Workspace } from "@domain/models/workspace";

export async function createWorkspace(
  body: unknown,
  token: unknown,
  context: Context,
) {
  const uuid = new UuidRepository();
  const jwt = new JsonWebTokenJWTRepository(context.jwtSecret);
  const workspace = new WorkspaceRepositoryInMemory(context.DbPool);
  const user = new UserRepositoryInMemory(context.DbPool);
  const usecase = new CreateWorkspaceUsecase(workspace, jwt, uuid, user);

  NewWorkspace.isNewWorkspace(body);
  await usecase.authenticate(isJwtToken(token) ? token.slice(7) : "");
  const ws = await usecase.execute({
    ...(body as NewWorkspace),
  });

  return ws.toJson() as Workspace;
}
