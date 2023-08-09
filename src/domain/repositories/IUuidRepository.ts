import { Uuid } from "../types";

export interface IUuidRepository {
  createV4(): Uuid;
}
