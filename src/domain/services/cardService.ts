import { IUuidRepository } from "../repositories/IUuidRepository";
import { ICardRepository } from "@domain/repositories/ICardRepository";
import { Paginate, Filter, Args } from "../repositories/shared/ICRUD";
import { Card } from "@domain/models/card";
import { NewCard } from "@domain/types";
import { ITableRepository } from "@domain/repositories/ITableRepostory";
import { DomainError } from "@domain/error";

export class CardService {
  static async create(
    dependencies: {
      card: ICardRepository;
      table: ITableRepository;
      uuid: IUuidRepository;
    },
    cardDto: NewCard,
  ): Promise<Card> {
    // check if table exists
    const TableExists = await dependencies.table.filter_one({
      where: [{ id: cardDto.tableId }],
      select: [],
    });

    if (!TableExists)
      throw new DomainError({ errors: { tableId: "doesn't exists" } }, 422);

    const workspace = new Card(
      dependencies.uuid.createV4(),
      cardDto.title,
      cardDto.description,
      cardDto.tableId,
      new Date(),
      new Date(),
    );

    return await dependencies.card.insert(workspace);
  }

  static async paginate(
    dependencies: {
      card: ICardRepository;
    },
    filter: Filter<Card>,
    args: Args,
  ): Promise<Paginate<Partial<Card>>> {
    return await dependencies.card.paginate(filter, args);
  }

  static async filter_one(
    dependencies: { card: ICardRepository },
    filter: Filter<Card>,
  ): Promise<Card | null> {
    return await dependencies.card.filter_one(filter);
  }

  static async delete_one(
    dependencies: { card: ICardRepository },
    filter: Filter<Card>,
  ): Promise<void> {
    return dependencies.card.delete(filter);
  }

  static async update_one(
    dependencies: { card: ICardRepository },
    filter: Filter<Card>,
    newData: Partial<Card>,
  ): Promise<void> {
    return dependencies
      .card
      .update(
        filter,
        newData
      );
  }
}
