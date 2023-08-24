import { DomainError } from "@domain/error";
import { Uuid } from "@domain/types";

export class NewCardDto {
  constructor(
    public title: string,
    public description: string,
    public tableId: Uuid,
  ) { }

  static isNewCardDto(value: unknown): value is NewCardDto {
    if (
      typeof value === "object" &&
      value !== null &&
      "title" in value &&
      "description" in value &&
      "tableId" in value
    ) {
      const newCard = value as NewCardDto;

      // Additional validation: Ensure that title, description, and workspaceId are valid
      if (
        typeof newCard.title === "string" &&
        newCard.title.trim() !== "" &&
        typeof newCard.description === "string" &&
        newCard.description.trim() !== "" &&
        typeof newCard.tableId === "string"
      ) {
        return true;
      }
    }
    throw new DomainError("deu ruim", 422);
  }
}
