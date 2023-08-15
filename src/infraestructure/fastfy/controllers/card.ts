import { FastifyRequest, FastifyReply } from "fastify";
import { Context, Controller } from "../types";
import { CreateCardUsecase } from "@application/usecases/card/createCard";
import { UuidRepository } from "@infraestructure/repositories/uuid/UuidRepository";
import { JsonWebTokenJWTRepository } from "@infraestructure/repositories/jsonWebToken/JsonWebTokenRepository";
import { WorkspaceRepositoryInMemory } from "@infraestructure/repositories/inMemory/WorkspaceRepositoryInMemory";
import { CatchDomainError } from "../error/catchDomainError";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";
import { CardRepositoryInMemory } from "@infraestructure/repositories/inMemory/CardRepositoryInMemory";
import { NewCardDto } from "@application/dtos/NewCard";

async function createWorkspace(
  req: FastifyRequest,
  res: FastifyReply,
  context: Context,
) {
  const uuid = new UuidRepository();
  const jwt = new JsonWebTokenJWTRepository(context.jwtSecret);
  const workspace = new WorkspaceRepositoryInMemory(context.DbPool.workspaces);
  const user = new UserRepositoryInMemory(context.DbPool.users);
  const card = new CardRepositoryInMemory(context.DbPool.cards);
  try {
    const body = req.body;
    if (NewCardDto.isNewCardDto(body)) {
      (
        await new CreateCardUsecase(
          card,
          uuid,
          jwt,
          user,
          workspace,
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

export const CARD_CONTROLLERS: Controller[] = [
  {
    path: "/cards",
    handler: createWorkspace,
    defaultCode: 201,
    method: "post",
  },
];
