import { TableRepositoryInMemory } from "@infraestructure/repositories/inMemory/TableRepositoryInMemory";
import { Context } from "../types";
import { UuidRepository } from "@infraestructure/repositories/uuid/UuidRepository";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";
import { JsonWebTokenJWTRepository } from "@infraestructure/repositories/jsonWebToken/JsonWebTokenRepository";
import { CreateTableUsecase } from "@application/usecases/table/createTable";
import { NewTable } from "@application/dtos/newTable";
import { isJwtToken } from "../shared/isJwtToken";

export async function createTable(
  body: unknown,
  token: unknown,
  context: Context,
) {
  const table = new TableRepositoryInMemory(context.DbPool);
  const uuid = new UuidRepository();
  const user = new UserRepositoryInMemory(context.DbPool);
  const jwt = new JsonWebTokenJWTRepository(context.jwtSecret);
  const usecase = new CreateTableUsecase(table, uuid, user, jwt);

  if (!NewTable.isNewTable(body)) { throw "" }
  await usecase.authenticate(isJwtToken(token) ? token.slice(7) : '')
  return await usecase.execute(body)
}

