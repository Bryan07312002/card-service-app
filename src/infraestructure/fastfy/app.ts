import Fastify from "fastify";
import { AUTHENTICATION_CONTROLLERS } from "./controllers/authentication";
import { WORKSPACE_CONTROLLERS } from "./controllers/workspace";
import { Context } from "./types";

async function main() {
  const fastify = Fastify({
    logger: true,
  });
  const controllers = [...AUTHENTICATION_CONTROLLERS, ...WORKSPACE_CONTROLLERS];

  const context: Context = {
    hashSalt: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    jwtSecret: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    DbPool: { users: [], workspaces: [] },
  };

  controllers.forEach((controller) => {
    fastify[controller.method](controller.path, (request, reply) => {
      return controller.handler(request, reply, context);
    });
  });

  // Declare a route
  fastify.get("/", async function handler(request, reply) {
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
