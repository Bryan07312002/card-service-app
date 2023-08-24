import { DomainError } from "@domain/error";

export class NewWorkspace {
  constructor(
    public name: string,
    public description?: string,
  ) { }

  static isNewWorkspace(value: unknown): value is NewWorkspace {
    if (typeof value === "object" && value !== null) {
      const workspace = value as NewWorkspace;

      if (typeof workspace.name !== "string")
        throw new DomainError({ errors: { name: "must be set as string" } }, 422);

      if (
        workspace.description !== undefined &&
        typeof workspace.description !== "string"
      )
        throw new DomainError({ errors: { description: "must be set as string" } }, 422);

      return true;
    }
    throw new DomainError("bad obj", 422);
  }
}
