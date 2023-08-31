import { RegisterFormDto } from "@application/dtos/registerForm";
import { RegisterUserUsecase } from "@application/usecases/authentication/register";
import { Context } from "@infraestructure/controllers/types";
import { Argon2HashRepository } from "@infraestructure/repositories/argon2/argon2Respository";
import { UserRepositoryInMemory } from "@infraestructure/repositories/inMemory/UserRepositoryInMemory";
import { UuidRepository } from "@infraestructure/repositories/uuid/UuidRepository";

export async function register(body: unknown, context: Context) {
  const hash = new Argon2HashRepository(context.hashSalt);
  const user = new UserRepositoryInMemory(context.DbPool);
  const uuid = new UuidRepository();

  RegisterFormDto.isRegisterForm(body);
  const newRegistredUser = await new RegisterUserUsecase(
    user,
    hash,
    uuid,
  ).execute({
    username: (body as RegisterFormDto).username,
    email: (body as RegisterFormDto).email,
    password: (body as RegisterFormDto).password,
  });

  return newRegistredUser.toJson();
}
