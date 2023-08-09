import { describe, expect, it } from "@jest/globals";
import { Card } from "@domain/models/card";

describe("Card tests", () => {
  it("should have valid properties", () => {
    const createdAt = new Date(2021, 0, 1);
    const updatedAt = new Date(2021, 0, 2);
    const card = new Card(
      "a-a-a-a-a-a",
      "Task",
      "Complete the assignment.",
      "aa-a-a-a-a-a",
      createdAt,
      updatedAt,
    );

    expect(card.id).toBe("a-a-a-a-a-a");
    expect(card.title).toBe("Task");
    expect(card.description).toBe("Complete the assignment.");
    expect(card.createdAt).toBe(createdAt);
    expect(card.updatedAt).toBe(updatedAt);
  });

  it("should update title and update updatedAt", () => {
    const updatedAt = new Date(2021, 0, 2);
    const card = new Card(
      "a-a-a-a-a-a",
      "Task",
      "Complete the assignment.",
      "aa-a-a-a-a-a",
      new Date(),
      updatedAt,
    );

    const initialUpdatedAt = card.updatedAt;

    card.title = "Updated Task";

    expect(card.title).toBe("Updated Task");
    expect(card.updatedAt).not.toBe(initialUpdatedAt);
  });

  it("should update description and update updatedAt", () => {
    const updatedAt = new Date(2021, 0, 2);
    const card = new Card(
      "a-a-a-a-a",
      "Task",
      "Complete the assignment.",
      "aa-a-a-a-a-a",
      new Date(),
      updatedAt,
    );

    const initialUpdatedAt = card.updatedAt;

    card.description = "Updated description";

    expect(card.description).toBe("Updated description");
    expect(card.updatedAt).not.toBe(initialUpdatedAt);
  });
});
