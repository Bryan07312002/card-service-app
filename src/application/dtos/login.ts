import { DomainError } from "@domain/error";

export class LoginFormDto {
  constructor(
    public email: string,
    public password: string,
  ) { }

  static isLoginFormDto(obj: unknown): obj is LoginFormDto {
    if (!obj || typeof obj !== 'object') {
      throw new DomainError({ errors: 'Invalid object provided.' }, 422);
    }

    const { email, password } = obj as LoginFormDto;

    if (typeof email !== 'string' || email.trim() === '') {
      throw new DomainError({ errors: { email: 'Invalid email.' } }, 422);
    }

    if (typeof password !== 'string') {
      throw new DomainError({ errors: { password: 'Invalid password.' } }, 422);
    }

    return true;
  }
}
