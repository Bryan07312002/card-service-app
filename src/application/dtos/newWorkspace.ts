import { DomainError } from "@domain/error";

export class NewWorkspace {
  constructor(
    public title: string,
    public description?: string,
  ) {}

  static isNewWorkspace(value: unknown): value is NewWorkspace {
    if (typeof value === "object" && value !== null && "title" in value) {
      const workspace = value as NewWorkspace;

      if (
        typeof workspace.title === "string" &&
        workspace.title.trim() !== ""
      ) {
        // If description is provided, ensure it's a string
        if (
          workspace.description !== undefined &&
          typeof workspace.description !== "string"
        ) {
          return false;
        }

        return true;
      }
    }
    throw new DomainError("bad obj", 422);
  }
}
