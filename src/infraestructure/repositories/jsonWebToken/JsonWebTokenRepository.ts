import { DomainError } from "@domain/error";
import { IJwtRepository } from "@domain/repositories/IJwtRepository";
import { sign, verify, JsonWebTokenError } from "jsonwebtoken";

export class JsonWebTokenJWTRepository implements IJwtRepository {
  constructor(public secret: string) { }

  sign(payload: object): string {
    return sign(payload, this.secret, { expiresIn: "1h" });
  }

  verify(token: string): object {
    try {
      let claim = verify(token, this.secret) as object;
      return claim;
    } catch (e) {
      throw new DomainError((e as JsonWebTokenError).message, 401);
    }
  }
}
