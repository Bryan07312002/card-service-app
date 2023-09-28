import { IJwtRepository } from "@domain/repositories/IJwtRepository";

export class MockJwtRepository implements IJwtRepository {
  constructor(public secret: string) { }
  sign(payload: object): string {
    throw new Error("Method not implemented.");
  }
  verify(token: string): object {
    throw new Error("Method not implemented.");
  }

}
