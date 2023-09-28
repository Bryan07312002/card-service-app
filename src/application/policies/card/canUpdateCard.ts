import { DomainError } from "@domain/error";
import { ICardRepository } from "@domain/repositories/ICardRepository";
import { ITableRepository } from "@domain/repositories/ITableRepostory";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";
import { Uuid } from "@domain/types";
import { CardUtils } from "./shared/cardUtils";

/// Check if user is allowed to update card and throws domain erros if doesn´t
export class CanUpdateCardPolicy extends CardUtils {
  constructor(
    cardRepo: ICardRepository,
    tableRepo: ITableRepository,
    workspaceRepo: IWorkspaceRepository,
  ) { super(cardRepo, tableRepo, workspaceRepo) }

  async execute(cardId: Uuid, incomingUserId: Uuid) {
    const cardUserId = await this.getUserIdFromCardId(cardId);

    if (cardUserId !== incomingUserId)
      throw new DomainError(
        { errors: "card doesn´t belongs to the user" },
        422,
      );
  }
}
