import { IJwtRepository } from "@domain/repositories/IJwtRepository";
import { ICardRepository } from "@domain/repositories/ICardRepository";
import { Uuid } from "@domain/types";
import { checkAuthUsecase } from "../authentication/checkAuth";
import { IUserRepository } from "@domain/repositories/IUsersRepostiry";
import { CardService } from "@domain/services/cardService";
import { DomainError } from "@domain/error";
import { CanDeleteCardPolicy } from "@application/policies/card/canDeleteCard";
import { ITableRepository } from "@domain/repositories/ITableRepostory";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";

export class DeleteCardUsecase {
  private userId: Uuid | undefined;

  constructor(
    private CardRespository: ICardRepository,
    private tableRepository: ITableRepository,
    private workspaceRepository: IWorkspaceRepository,
    private jwtRepository: IJwtRepository,
    private userRepository: IUserRepository,
  ) { }

  async authenticate(token: string): Promise<DeleteCardUsecase> {
    this.userId = (
      await new checkAuthUsecase(
        this.jwtRepository,
        this.userRepository,
      ).execute(token)
    ).id;

    return this;
  }

  async execute(id: Uuid) {
    if (!this.userId) throw new DomainError("unauthenticated", 401);
    await new CanDeleteCardPolicy(
      this.CardRespository,
      this.tableRepository,
      this.workspaceRepository
    ).execute(id, this.userId);

    return CardService.delete_one(
      {
        card: this.CardRespository,
      },
      { where: [{ id }], select: [] },
    );
  }
}
