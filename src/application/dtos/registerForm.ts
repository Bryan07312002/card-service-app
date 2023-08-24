import { DomainError } from "@domain/error";

export class RegisterFormDto {
  constructor(
    public username: string,
    public email: string,
    public password: string,
  ) { }

  static isRegisterForm(value: unknown): value is RegisterFormDto {
    if (typeof value === "object" && value !== null) {
      const registerForm = value as RegisterFormDto;

      if (typeof registerForm.username !== "string")
        throw new DomainError({ errors: { username: "must be defined as string" } }, 422);

      if (typeof registerForm.email !== "string")
        throw new DomainError({ errors: { email: "must be defined as string" } }, 422);

      if (typeof registerForm.password !== "string")
        throw new DomainError({ errors: { password: "must be defined as string" } }, 422);

      return true;
    }

    throw new DomainError("wrong", 422);
  }
}
