import { IncomingMessage, ServerResponse } from "http";
import { FastifyRequest, FastifyReply } from "fastify";

type Controller = {
  path: string;
  defaultCode?: number;
  method: "get" | "post" | "delete" | "put" | "patch";
  handler: (req: FastifyRequest, res: FastifyReply, context: Context) => any;
};

export type Context = {
  hashSalt: string;
  jwtSecret: string;
  DbPool: any;
};
