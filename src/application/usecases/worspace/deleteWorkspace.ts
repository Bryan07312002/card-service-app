import { IJwtRepository } from "@domain/repositories/IJwtRepository";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";
import { WorkspaceService } from "@domain/services/workspaceService";
import { Uuid } from "@domain/types";
import { checkAuthUsecase } from "../authentication/checkAuth";
import { IUserRepository } from "@domain/repositories/IUsersRepostiry";
import { DomainError } from "@domain/error";

export class DeleteWorkspaceById {
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

  async execute(id: Uuid) {
    if (!this.userId) throw new DomainError("unauthenticated", 401);

    WorkspaceService.delete_one(
      {
        workspace: this.workspaceRespository,
      },
      {
        where: [{ id }],
        select: [],
      },
    );
  }
}
