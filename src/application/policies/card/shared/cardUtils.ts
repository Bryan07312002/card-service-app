import { ICardRepository } from "@domain/repositories/ICardRepository";
import { ITableRepository } from "@domain/repositories/ITableRepostory";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";
import { Uuid } from "@domain/types";

/// Check if user is allowed to remove card and throws domain erros if doesn´t
export class CardUtils {
  constructor(
    private cardRepository: ICardRepository,
    private tableRepository: ITableRepository,
    private workspaceRepository: IWorkspaceRepository,
  ) { }

  async getUserIdFromCardId(cardId: Uuid): Promise<Uuid | null> {
    const card = await this.cardRepository.filter_one({
      where: [{ id: cardId }],
      select: [],
    });
    if (!card) return null

    const table = await this.tableRepository.filter_one({
      where: [{ id: card?.tableId }],
      select: [],
    });
    if (!table) return null

    const worksapce = await this.workspaceRepository.filter_one({
      where: [{ id: table?.workspaceId as Uuid }],
      select: [],
    });

    return worksapce?.userId ?? null
  }
}
