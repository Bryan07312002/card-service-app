import { IJwtRepository } from "@domain/repositories/IJwtRepository";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";
import { WorkspaceService } from "@domain/services/workspaceService";
import { Uuid } from "@domain/types";
import { checkAuthUsecase } from "../authentication/checkAuth";
import { IUserRepository } from "@domain/repositories/IUsersRepostiry";
import { DomainError } from "@domain/error";
import { Args } from "@domain/repositories/shared/ICRUD";

export class PaginateWorkspacesByUserUuid {
  private userId: Uuid | undefined;

  constructor(
    private workspaceRespository: IWorkspaceRepository,
    private jwtRepository: IJwtRepository,
    private userRepository: IUserRepository,
  ) {}

  async authenticate(token: string) {
    this.userId = (
      await new checkAuthUsecase(
        this.jwtRepository,
        this.userRepository,
      ).execute(token)
    ).id;

    return this;
  }

  async execute(args: Args) {
    if (!this.userId) throw new DomainError("unauthenticated", 401);

    return WorkspaceService.paginate(
      {
        workspace: this.workspaceRespository,
      },
      {
        where: [{ userId: this.userId }],
        select: [],
      },
      args,
    );
  }
}
