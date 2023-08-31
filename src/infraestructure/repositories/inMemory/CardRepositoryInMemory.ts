import { ICardRepository } from "@domain/repositories/ICardRepository";
import { AbstractCrudRepositoryInMemory } from "./shared/AbstractCrudRepositoryInMemory";
import { Card } from "@domain/models/card";

export class CardRepositoryInMemory
  extends AbstractCrudRepositoryInMemory<Card>
  implements ICardRepository
{
  tableName: string = "cards";
}
