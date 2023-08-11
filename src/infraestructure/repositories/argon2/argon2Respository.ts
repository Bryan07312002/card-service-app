import { IHashRepository } from "@domain/repositories/IHashRespository";
import * as argon2 from "argon2";

export class Argon2HashRepository implements IHashRepository {
  constructor(public salt: string) {}

  async hash(incomingString: string): Promise<string> {
    return await argon2.hash(incomingString, { salt: Buffer.from(this.salt) });
  }
}
