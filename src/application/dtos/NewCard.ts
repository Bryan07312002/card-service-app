import { DomainError } from "@domain/error";
import { Uuid } from "@domain/types";

export class NewCardDto {
  constructor(
    public title: string,
    public description: string,
    public tableId: Uuid,
  ) { }

  static isNewCardDto(value: unknown): value is NewCardDto {
    const newCard = value as NewCardDto;

    if (typeof newCard.title !== "string")
      throw new DomainError({ errors: { title: "should be a string" } }, 422);

    if (newCard.description != undefined)
      if (typeof newCard.description !== "string")
        throw new DomainError(
          { errors: { description: "should be a string" } },
          422,
        );

    if (typeof newCard.tableId !== "string")
      throw new DomainError({ errors: { tableId: "should be a string" } }, 422);

    return true;
  }
}
