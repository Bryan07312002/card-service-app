import { IHashRepository } from "@domain/repositories/IHashRespository";

export class MockHashRepository implements IHashRepository {
  constructor(public salt: string) { }

  async hash(incomingString: string): Promise<string> {
    return incomingString;
  }
}
