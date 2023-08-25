import { IJwtRepository } from "@domain/repositories/IJwtRepository";
import { ICardRepository } from "@domain/repositories/ICardRepository";
import { IUuidRepository } from "@domain/repositories/IUuidRepository";
import { Uuid } from "@domain/types";
import { checkAuthUsecase } from "../authentication/checkAuth";
import { IUserRepository } from "@domain/repositories/IUsersRepostiry";
import { CardService } from "@domain/services/cardService";
import { DomainError } from "@domain/error";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";
import { NewCardDto } from "@application/dtos/NewCard";

export class CreateCardUsecase {
  private userId: Uuid | undefined;

  constructor(
    private CardRespository: ICardRepository,
    private uuidRepository: IUuidRepository,
    private jwtRepository: IJwtRepository,
    private userRepository: IUserRepository,
    private workspaceRepository: IWorkspaceRepository,
  ) { }

  async authenticate(token: string): Promise<CreateCardUsecase> {
    this.userId = (
      await new checkAuthUsecase(
        this.jwtRepository,
        this.userRepository,
      ).execute(token)
    ).id;

    return this;
  }

  async execute(newCard: NewCardDto) {
    if (!this.userId) throw new DomainError("unauthenticated", 401);

    const isWorkspaceFromUser = await this.workspaceRepository.filter_one({
      where: [{ id: newCard.tableId, userId: this.userId }],
      select: [],
    });

    if (!isWorkspaceFromUser) throw new DomainError("cant create card", 422);

    return CardService.create(
      {
        uuid: this.uuidRepository,
        card: this.CardRespository,
      },
      { ...newCard },
    );
  }
}
