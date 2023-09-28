import { Card } from "@domain/models/card";
import { ICardRepository } from "@domain/repositories/ICardRepository";
import { Filter, Args, Paginate } from "@domain/repositories/shared/ICRUD";

export class MockCardRepository implements ICardRepository {
  insert(_: Card): Promise<Card> {
    throw new Error("Method not implemented.");
  }

  filter_one(_: Filter<Card>): Promise<Card | null> {
    throw new Error("Method not implemented.");
  }

  paginate(_: Filter<Card>, __: Args): Promise<Paginate<Partial<Card>>> {
    throw new Error("Method not implemented.");
  }

  delete(_: Filter<Card>): Promise<void> {
    throw new Error("Method not implemented.");
  }

  update(_: Filter<Card>, __: Partial<Card>): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
