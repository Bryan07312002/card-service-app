import { LoginFormDto } from "@application/dtos/login";
import { LoginUsecase, TokenPair } from "@application/usecases/authentication/login";
import { Argon2HashRepository } from "@infraestructure/repositories/argon2/argon2Respository";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";
import { JsonWebTokenJWTRepository } from "@infraestructure/repositories/jsonWebToken/JsonWebTokenRepository";
import { Context } from "@infraestructure/controllers/types";

export async function login(body: unknown, context: Context): Promise<TokenPair> {
  const hash = new Argon2HashRepository(context.hashSalt);
  const user = new UserRepositoryInMemory(context.DbPool);
  const jwt = new JsonWebTokenJWTRepository(context.jwtSecret);

  LoginFormDto.isLoginFormDto(body);
  return new LoginUsecase(user, hash, jwt).execute({
    email: (body as LoginFormDto).email,
    password: (body as LoginFormDto).password,
  });
}


