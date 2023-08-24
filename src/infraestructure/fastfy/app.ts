import Fastify from "fastify";
import { AUTHENTICATION_CONTROLLERS } from "./controllers/authentication";
import { WORKSPACE_CONTROLLERS } from "./controllers/workspace";
import { CARD_CONTROLLERS } from "./controllers/card";
import { TABLE_CONTROLLERS } from "./controllers/table";
import { Context } from "./types";
import { CatchDomainError } from "./error/catchDomainError";

async function main() {
  const fastify = Fastify({
    logger: true,
  });

  const controllers = [
    ...AUTHENTICATION_CONTROLLERS,
    ...WORKSPACE_CONTROLLERS,
    ...CARD_CONTROLLERS,
    ...TABLE_CONTROLLERS,
  ];

  const context: Context = {
    hashSalt: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    jwtSecret: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    DbPool: { users: [], workspaces: [], tables: [] },
  };

  controllers.forEach((controller) => {
    fastify[controller.method](controller.path, async (request, reply) => {
      try {
        return await controller.handler(request, reply, context);
      } catch (e) {
        if (CatchDomainError.isDomainError(e)) {
          return new CatchDomainError(e).toFasfyReply(reply);
        }

        console.log(e)
        return reply.code(500).send({ error: "internal server error" });
      }
    });
  });

  // Declare a route
  fastify.get("/", async function handler() {
    return context.DbPool;
  });

  // Run the server!
  try {
    await fastify.listen({ port: 4000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main().catch();
