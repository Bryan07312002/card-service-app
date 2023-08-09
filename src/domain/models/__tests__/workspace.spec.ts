import { describe, expect, it } from "@jest/globals";
import { Workspace } from "@domain/models/workspace";

describe("Workspace tests", () => {
  it("should create a workspace with valid properties", () => {
    const workspace = new Workspace(
      "a-a-a-a-a-a",
      "My Workspace",
      "user123",
      "A description of the workspace.",
    );

    expect(workspace.name).toBe("My Workspace");
    expect(workspace.userId).toBe("user123");
    expect(workspace.description).toBe("A description of the workspace.");
  });

  it("should throw an error for invalid name length", () => {
    try {
      new Workspace("a-a-a-a-a", "abc", "user123", "A description");
    } catch (error) {
      expect(error).toBe("Name must be at least 4 characters.");
    }
  });

  it("should serialize user to JSON", () => {
    const serialized = new Workspace(
      "a-a-a-a-a-a",
      "My Workspace",
      "user123",
      "A description of the workspace.",
    ).toJson();
    expect(serialized).toEqual({
      id: "a-a-a-a-a-a",
      name: "My Workspace",
      userId: "user123",
      description: "A description of the workspace.",
    });
  });
});
