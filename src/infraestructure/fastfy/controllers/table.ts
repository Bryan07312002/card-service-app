import { FastifyReply, FastifyRequest } from "fastify";
import { Context, Controller } from "../types";
import { createTable as createTableController } from "@infraestructure/controllers/tables/createTable";

async function createTable(
  req: FastifyRequest,
  res: FastifyReply,
  context: Context,
) {
  return res
    .code(201)
    .send(
      await createTableController(
        req.body,
        req.headers.authorization,
        context
      )
    );
}

export const TABLE_CONTROLLERS: Controller[] = [
  { path: "/tables", handler: createTable, defaultCode: 201, method: "post" },
];
