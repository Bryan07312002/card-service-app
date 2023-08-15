import { Controller } from "../types";
import { LoginUsecase } from "@application/usecases/authentication/login";
import { RegisterUserUsecase } from "@application/usecases/authentication/register";
import { RegisterFormDto } from "@application/dtos/registerForm";
import { LoginFormDto } from "@application/dtos/login";
import { Context } from "../types";
import { CatchDomainError } from "../error/catchDomainError";
// repositories
import { Argon2HashRepository } from "@infraestructure/repositories/argon2/argon2Respository";
import { JsonWebTokenJWTRepository } from "@infraestructure/repositories/jsonWebToken/JsonWebTokenRepository";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";
import { UuidRepository } from "@infraestructure/repositories/uuid/UuidRepository";
import { FastifyRequest, FastifyReply } from "fastify";

async function register(
  req: FastifyRequest,
  res: FastifyReply,
  context: Context,
) {
  const body: unknown = req.body;
  const hash = new Argon2HashRepository(context.hashSalt);
  const user = new UserRepositoryInMemory(context.DbPool.users);
  const uuid = new UuidRepository();
  try {
    if (!RegisterFormDto.isRegisterForm(body)) return;

    const u = await new RegisterUserUsecase(user, hash, uuid).execute({
      username: body.username,
      email: body.email,
      password: body.password,
    });

    return res.code(201).send(u.toJson());
  } catch (e: unknown) {
    if (CatchDomainError.isDomainError(e)) {
      return new CatchDomainError(e).toFasfyReply(res);
    }

    return res.send("Internal Error").code(500);
  }
}

async function login(req: FastifyRequest, res: FastifyReply, context: Context) {
  const body: any = req.body;
  const hash = new Argon2HashRepository(context.hashSalt);
  const user = new UserRepositoryInMemory(context.DbPool.users);
  const jwt = new JsonWebTokenJWTRepository(context.jwtSecret);
  try {
    if (LoginFormDto.isLoginFormDto(body)) {
      const u = await new LoginUsecase(user, hash, jwt).execute({
        email: body.email,
        password: body.password,
      });
      res.send(u);
    }
  } catch (e: unknown) {
    if (CatchDomainError.isDomainError(e)) {
      return new CatchDomainError(e).toFasfyReply(res);
    }

    return res.send("Internal Error").code(500);
  }
}

export const AUTHENTICATION_CONTROLLERS: Controller[] = [
  { path: "/register", handler: register, defaultCode: 201, method: "post" },
  { path: "/login", handler: login, defaultCode: 200, method: "post" },
];
