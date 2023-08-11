import { DomainError } from "@domain/error";
import { FastifyReply } from "fastify";

export class CatchDomainError {
  private _error: DomainError;

  constructor(error: DomainError) {
    this._error = error;
  }

  static isDomainError(err: any): err is DomainError {
    if ((err as any)["code"] === undefined) return false;
    if ((err as any)["message"] === undefined) return false;

    return true;
  }

  toFasfyReply(reply: FastifyReply): FastifyReply {
    return reply
      .code(this._error.code)
      .send({ error: this._error.toJson().message });
  }
}
