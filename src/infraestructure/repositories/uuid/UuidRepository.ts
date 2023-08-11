import { v4 } from "uuid";
import { IUuidRepository } from "@domain/repositories/IUuidRepository";
import { Uuid } from "@domain/types";

export class UuidRepository implements IUuidRepository {
  createV4(): Uuid {
    return v4().toString() as Uuid;
  }
}
