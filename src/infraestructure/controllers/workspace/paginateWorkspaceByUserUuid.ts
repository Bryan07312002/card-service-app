import { PaginateWorkspacesByUserUuid } from "@application/usecases/worspace/paginateWorkspace";
import { Context } from "@infraestructure/controllers/types";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";
import { WorkspaceRepositoryInMemory } from "@infraestructure/repositories/inMemory/WorkspaceRepositoryInMemory";
import { JsonWebTokenJWTRepository } from "@infraestructure/repositories/jsonWebToken/JsonWebTokenRepository";
import { isJwtToken } from "@infraestructure/controllers/shared/isJwtToken";
import { isConvertibleToNumber } from "../shared/isConvertibleToNumber";

export async function paginateWorkspaceByUserUuid(
  take: unknown,
  page: unknown,
  token: unknown,
  context: Context,
) {
  const jwt = new JsonWebTokenJWTRepository(context.jwtSecret);
  const workspace = new WorkspaceRepositoryInMemory(context.DbPool);
  const user = new UserRepositoryInMemory(context.DbPool);
  const usecase = new PaginateWorkspacesByUserUuid(workspace, jwt, user);

  await usecase.authenticate(isJwtToken(token) ? token.slice(7) : "");

  const paginateWorkspaces = await usecase.execute({
    take: isConvertibleToNumber(take) ? Number(take) : 10,
    page: isConvertibleToNumber(page) ? Number(page) : 1,
  });

  return paginateWorkspaces;
}
