import { Uuid } from "@domain/types";

export class UpdateCardDto {
  constructor(
    public title?: string,
    public description?: string,
    public tableId?: Uuid,
  ) { }

  static isUpdateCardDto(obj: unknown): obj is UpdateCardDto {
    // Use type assertion to narrow down the type to UpdateCardDto
    const updateCard = obj as UpdateCardDto;

    // Check if updateCard is an instance of UpdateCardDto
    return (
      updateCard &&
      typeof updateCard === "object" &&
      typeof updateCard.title === "string" &&
      typeof updateCard.description === "string" &&
      (updateCard.tableId === undefined || typeof updateCard.tableId === "string")
    );
  }
}


