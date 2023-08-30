import { DomainError } from "@domain/error";
import { ICardRepository } from "@domain/repositories/ICardRepository";
import { ITableRepository } from "@domain/repositories/ITableRepostory";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";
import { Uuid } from "@domain/types";

/// Check if user is allowed to remove card and throws domain erros if doesn´t
export class CanDeleteCardPolicy {
  constructor(
    private cardRepository: ICardRepository,
    private tableRepository: ITableRepository,
    private workspaceRepository: IWorkspaceRepository,
  ) { }

  async execute(cardId: Uuid, userId: Uuid) {
    const card = await this
      .cardRepository
      .filter_one({ where: [{ id: cardId }], select: [] });

    const table = await this
      .tableRepository
      .filter_one({ where: [{ id: card?.tableId }], select: [] });

    const worksapce = await this
      .workspaceRepository
      .filter_one({ where: [{ id: table?.workspaceId as Uuid }], select: [] });

    if (worksapce?.userId !== userId) throw new DomainError({ errors: "card doesn´t belongs to the user" }, 403);
  }
}
