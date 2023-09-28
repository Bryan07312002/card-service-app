import { ICardRepository } from "@domain/repositories/ICardRepository";
import { IJwtRepository } from "@domain/repositories/IJwtRepository";
import { ITableRepository } from "@domain/repositories/ITableRepostory";
import { IUserRepository } from "@domain/repositories/IUsersRepostiry";
import { Uuid } from "@domain/types";
import { checkAuthUsecase } from "../authentication/checkAuth";
import { DomainError } from "@domain/error";
import { UpdateCardDto } from "@application/dtos/updateCard";
import { CanUpdateCardPolicy } from "@application/policies/card/canUpdateCard";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";
import { CardService } from "@domain/services/cardService";

export class UpdateCardUsecase {
  private userId: Uuid | undefined;

  constructor(
    private CardRespository: ICardRepository,
    private jwtRepository: IJwtRepository,
    private userRepository: IUserRepository,
    private workspacerepository: IWorkspaceRepository,
    private tableRepository: ITableRepository,
  ) { }

  async authenticate(token: string): Promise<UpdateCardUsecase> {
    this.userId = (
      await new checkAuthUsecase(
        this.jwtRepository,
        this.userRepository,
      ).execute(token)
    ).id;

    return this;
  }

  async execute(id: Uuid, incomingData: UpdateCardDto): Promise<void> {
    if (!this.userId) throw new DomainError("unauthenticated", 401);
    await new CanUpdateCardPolicy(this.CardRespository, this.tableRepository, this.workspacerepository).execute(id, this.userId);

    return CardService.update_one(
      { card: this.CardRespository },
      { where: [{ id }], select: [] },
      incomingData
    )
  }
}
