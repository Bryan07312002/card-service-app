import { NewCardDto } from "@application/dtos/NewCard";
import { CreateCardUsecase } from "@application/usecases/card/createCard";
import { Context } from "@infraestructure/controllers/types";
import { CardRepositoryInMemory } from "@infraestructure/repositories/inMemory/CardRepositoryInMemory";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";
import { WorkspaceRepositoryInMemory } from "@infraestructure/repositories/inMemory/WorkspaceRepositoryInMemory";
import { JsonWebTokenJWTRepository } from "@infraestructure/repositories/jsonWebToken/JsonWebTokenRepository";
import { UuidRepository } from "@infraestructure/repositories/uuid/UuidRepository";
import { isJwtToken } from "../shared/isJwtToken";
import { Card } from "@domain/models/card";

export async function createCardController(
  body: unknown,
  token: unknown,
  context: Context,
) {
  const uuid = new UuidRepository();
  const jwt = new JsonWebTokenJWTRepository(context.jwtSecret);
  const workspace = new WorkspaceRepositoryInMemory(context.DbPool);
  const user = new UserRepositoryInMemory(context.DbPool);
  const card = new CardRepositoryInMemory(context.DbPool);
  const usecase = new CreateCardUsecase(
    card,
    uuid,
    jwt,
    user,
    workspace,
  );

  if (!NewCardDto.isNewCardDto(body)) throw ""
  await usecase.authenticate(isJwtToken(token) ? token.slice(7) : "");

  const c = await usecase.execute(body);
  return c.toJson() as Card;
}

