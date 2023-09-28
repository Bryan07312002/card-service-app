import { IUuidRepository } from "@domain/repositories/IUuidRepository";

/// class used to mock data for testitng
export class MockUuidRepository implements IUuidRepository {
  createV4(): `${string}-${string}-${string}-${string}-${string}` {
    return "a-a-a-a-a";
  }
}
