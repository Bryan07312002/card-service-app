import { FastifyRequest, FastifyReply } from "fastify";
import { Context, Controller } from "../types";
import { createCardController } from "@infraestructure/controllers/card/createCard";

async function createCard(
  req: FastifyRequest,
  res: FastifyReply,
  context: Context,
) {
  return res
    .code(201)
    .send(
      await createCardController(req.body, req.headers.authorization, context),
    );
}

export const CARD_CONTROLLERS: Controller[] = [
  {
    path: "/cards",
    handler: createCard,
    defaultCode: 201,
    method: "post",
  },
];
