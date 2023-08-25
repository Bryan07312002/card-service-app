import { JsonWebTokenJWTRepository } from "@infraestructure/repositories/jsonWebToken/JsonWebTokenRepository";
import { Context } from "../types";
import { WorkspaceRepositoryInMemory } from "@infraestructure/repositories/inMemory/WorkspaceRepositoryInMemory";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";
import { TableRepositoryInMemory } from "@infraestructure/repositories/inMemory/TableRepositoryInMemory";
import { CardRepositoryInMemory } from "@infraestructure/repositories/inMemory/CardRepositoryInMemory";
import { GetFullWorkspaceByUuid } from "@application/usecases/worspace/getFullTableById";
import { isUuid } from "@application/usecases/shared/utilsValidators";
import { isJwtToken } from "../shared/isJwtToken";

export async function getFullWorkspaceByUuid(
  id: unknown,
  token: unknown,
  context: Context,
) {
  const jwt = new JsonWebTokenJWTRepository(context.jwtSecret);
  const workspace = new WorkspaceRepositoryInMemory(context.DbPool.workspaces);
  const user = new UserRepositoryInMemory(context.DbPool.users);
  const table = new TableRepositoryInMemory(context.DbPool.tables);
  const card = new CardRepositoryInMemory(context.DbPool.cards);
  const usecase = new GetFullWorkspaceByUuid(workspace, table, card, user, jwt);

  if (!isUuid(id)) throw "not uuid";
  await usecase.authenticate(isJwtToken(token) ? token.slice(7) : '')
  const fullWs = await usecase.execute(id);

  return {
    name: fullWs.name,
    description: fullWs.description,
    tables: fullWs.tables.map(el => {
      const jsonCards = el.cards.map(c => {
        const card: any = c.toJson();
        delete card.tableId;
      })
      const jsonTable: any = el.toJson();

      return {
        id: jsonTable.id,
        title: jsonTable.title,
        cards: jsonCards,
      }
    })
  }
}
