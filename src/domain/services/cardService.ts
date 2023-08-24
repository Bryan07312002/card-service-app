import { IUuidRepository } from "../repositories/IUuidRepository";
import { ICardRepository } from "@domain/repositories/ICardRepository";
import { Paginate, Filter, Args } from "../repositories/shared/ICRUD";
import { Card } from "@domain/models/card";
import { NewCard, Uuid } from "@domain/types";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";

export class CardService {
  static async create(
    dependencies: {
      card: ICardRepository;
      uuid: IUuidRepository;
    },
    cardDto: NewCard,
  ): Promise<Card> {
    // TODO: validation
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

  static async canCreateCard(
    dependencies: { workspace: IWorkspaceRepository },
    userId: Uuid,
    workspaceId: Uuid,
  ) {
    await dependencies.workspace.filter_one({
      where: [{ id: workspaceId, userId: userId }],
      select: [],
    });
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
  ): Promise<Card> {
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
    return dependencies.card.Update(filter, newData);
  }
}
