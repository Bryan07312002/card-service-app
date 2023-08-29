import { DeleteWorkspaceById } from "@application/usecases/worspace/deleteWorkspace";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";
import { WorkspaceRepositoryInMemory } from "@infraestructure/repositories/inMemory/WorkspaceRepositoryInMemory";
import { JsonWebTokenJWTRepository } from "@infraestructure/repositories/jsonWebToken/JsonWebTokenRepository";
import { Context } from "../types";
import { isJwtToken } from "../shared/isJwtToken";
import { isUuid } from "@application/usecases/shared/utilsValidators";

export async function deleteWorkspaceByIdController(id: unknown, token: unknown, context: Context) {
  const jwt = new JsonWebTokenJWTRepository(context.jwtSecret);
  const workspace = new WorkspaceRepositoryInMemory(context.DbPool);
  const user = new UserRepositoryInMemory(context.DbPool);
  const usecase = new DeleteWorkspaceById(workspace, jwt, user);

  await usecase.authenticate(isJwtToken(token) ? token.slice(7) : "");
  if (!isUuid(id)) throw "";
  return usecase.execute(id);
}
