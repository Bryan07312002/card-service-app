import { NewCardDto } from "@application/dtos/NewCard";
import { CreateCardUsecase } from "@application/usecases/card/createCard";
import { Context } from "@infraestructure/controllers/types";
import { CardRepositoryInMemory } from "@infraestructure/repositories/inMemory/CardRepositoryInMemory";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";
import { JsonWebTokenJWTRepository } from "@infraestructure/repositories/jsonWebToken/JsonWebTokenRepository";
import { UuidRepository } from "@infraestructure/repositories/uuid/UuidRepository";
import { isJwtToken } from "../shared/isJwtToken";
import { Card } from "@domain/models/card";
import { TableRepositoryInMemory } from "@infraestructure/repositories/inMemory/TableRepositoryInMemory";

export async function createCardController(
  body: unknown,
  token: unknown,
  context: Context,
) {
  const uuid = new UuidRepository();
  const jwt = new JsonWebTokenJWTRepository(context.jwtSecret);
  const table = new TableRepositoryInMemory(context.DbPool);
  const user = new UserRepositoryInMemory(context.DbPool);
  const card = new CardRepositoryInMemory(context.DbPool);
  const usecase = new CreateCardUsecase(
    card,
    uuid,
    jwt,
    user,
    table
  );

  if (!NewCardDto.isNewCardDto(body)) throw ""
  await usecase.authenticate(isJwtToken(token) ? token.slice(7) : "");

  const c = await usecase.execute(body);
  return c.toJson() as Card;
}

