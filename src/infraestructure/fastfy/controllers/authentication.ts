import { Controller } from "../types";
import { FastifyRequest, FastifyReply } from "fastify";
import { Context } from "../types";
import { login as loginController } from "@infraestructure/controllers/authentication/loginControllers";
import { register as registerController } from "@infraestructure/controllers/authentication/registerController";

async function register(
  req: FastifyRequest,
  res: FastifyReply,
  context: Context,
) {
  return res.code(201).send(await registerController(req.body, context));
}

async function login(req: FastifyRequest, res: FastifyReply, context: Context) {
  return res.code(200).send(await loginController(req.body, context));
}

export const AUTHENTICATION_CONTROLLERS: Controller[] = [
  { path: "/register", handler: register, method: "post" },
  { path: "/login", handler: login, method: "post" },
];
