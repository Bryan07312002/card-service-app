import { DomainError } from "@domain/error";

export class LoginFormDto {
  constructor(
    public email: string,
    public password: string,
  ) {}

  static isLoginFormDto(value: unknown): value is LoginFormDto {
    if (
      typeof value === "object" &&
      value !== null &&
      "email" in value &&
      "password" in value
    ) {
      const loginForm = value as LoginFormDto;

      // Additional validation: Ensure that email is a valid email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        typeof loginForm.email === "string" &&
        emailPattern.test(loginForm.email) &&
        typeof loginForm.password === "string"
      ) {
        return true;
      }
    }
    throw new DomainError("deu ruim", 422);
  }
}
