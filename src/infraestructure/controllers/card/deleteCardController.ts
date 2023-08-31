import { Context } from "@infraestructure/controllers/types";
import { CardRepositoryInMemory } from "@infraestructure/repositories/inMemory/CardRepositoryInMemory";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";
import { JsonWebTokenJWTRepository } from "@infraestructure/repositories/jsonWebToken/JsonWebTokenRepository";
import { isJwtToken } from "../shared/isJwtToken";
import { DeleteCardUsecase } from "@application/usecases/card/deleteCard";
import { WorkspaceRepositoryInMemory } from "@infraestructure/repositories/inMemory/WorkspaceRepositoryInMemory";
import { TableRepositoryInMemory } from "@infraestructure/repositories/inMemory/TableRepositoryInMemory";
import { isUuid } from "@application/usecases/shared/utilsValidators";

export async function deleteCardController(
  id: unknown,
  token: unknown,
  context: Context,
) {
  const jwt = new JsonWebTokenJWTRepository(context.jwtSecret);
  const user = new UserRepositoryInMemory(context.DbPool);
  const card = new CardRepositoryInMemory(context.DbPool);
  const worksapce = new WorkspaceRepositoryInMemory(context.DbPool);
  const table = new TableRepositoryInMemory(context.DbPool);
  const usecase = new DeleteCardUsecase(card, table, worksapce, jwt, user);

  if (!isUuid(id)) throw "";
  await usecase.authenticate(isJwtToken(token) ? token.slice(7) : "");
  return usecase.execute(id);
}
