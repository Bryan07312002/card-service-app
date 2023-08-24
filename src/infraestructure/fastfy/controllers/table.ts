import { FastifyReply, FastifyRequest } from "fastify";
import { Context, Controller } from "../types";
import { CreateTableUsecase } from "@application/usecases/table/createTable";
import { UuidRepository } from "@infraestructure/repositories/uuid/UuidRepository";
import { JsonWebTokenJWTRepository } from "@infraestructure/repositories/jsonWebToken/JsonWebTokenRepository";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";
import { TableRepositoryInMemory } from "@infraestructure/repositories/inMemory/TableRepositoryInMemory";
import { NewTable } from "@application/dtos/newTable";
import { CatchDomainError } from "../error/catchDomainError";

async function createTable(
  req: FastifyRequest,
  res: FastifyReply,
  context: Context,
) {
  const table = new TableRepositoryInMemory(context.DbPool.tables);
  const uuid = new UuidRepository();
  const user = new UserRepositoryInMemory(context.DbPool.users);
  const jwt = new JsonWebTokenJWTRepository(context.jwtSecret);
  const usecase = new CreateTableUsecase(table, uuid, user, jwt);

  try {
    if (!NewTable.isNewTable(req.body)) { return }
    await usecase.authenticate(req.headers.authorization?.slice(7) ?? "")
    const table = await usecase.execute(req.body)
    return res.code(201).send(table.toJson());
  } catch (e) {
    if (CatchDomainError.isDomainError(e)) {
      return new CatchDomainError(e).toFasfyReply(res);
    }

    return res.send("InternalServerError").code(500);
  }
}

export const TABLE_CONTROLLERS: Controller[] = [
  { path: "/tables", handler: createTable, defaultCode: 201, method: "post" },
];
