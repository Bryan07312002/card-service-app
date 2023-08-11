import { DomainError } from "@domain/error";

export class RegisterFormDto {
  constructor(
    public username: string,
    public email: string,
    public password: string,
  ) {}

  static isRegisterForm(value: unknown): value is RegisterFormDto {
    if (
      typeof value === "object" &&
      value !== null &&
      "username" in value &&
      "email" in value &&
      "password" in value
    ) {
      const registerForm = value as RegisterFormDto;

      // You can add additional validation logic if needed
      if (
        typeof registerForm.username === "string" &&
        typeof registerForm.email === "string" &&
        typeof registerForm.password === "string"
      ) {
        return true;
      }
    }

    throw new DomainError("wrong", 422);
  }
}
