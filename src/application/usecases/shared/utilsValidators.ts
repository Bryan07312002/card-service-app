import { DomainError } from "@domain/error";
import { Uuid } from "@domain/types";

export function isUuid(value: unknown): value is Uuid {
  if (typeof value === "string") {
    const uuidPattern =
      /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
    return uuidPattern.test(value);
  }
  throw new DomainError("invalid Uuid", 422);
}
