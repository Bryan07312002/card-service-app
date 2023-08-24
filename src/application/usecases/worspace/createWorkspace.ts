import { IJwtRepository } from "@domain/repositories/IJwtRepository";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";
import { WorkspaceService } from "@domain/services/workspaceService";
import { IUuidRepository } from "@domain/repositories/IUuidRepository";
import { Uuid } from "@domain/types";
import { checkAuthUsecase } from "../authentication/checkAuth";
import { NewWorkspace } from "@application/dtos/newWorkspace";
import { IUserRepository } from "@domain/repositories/IUsersRepostiry";
import { DomainError } from "@domain/error";

export class CreateWorkspaceUsecase {
  private userId: Uuid | undefined;

  constructor(
    private workspaceRespository: IWorkspaceRepository,
    private jwtRepository: IJwtRepository,
    private uuidRepository: IUuidRepository,
    private userRepository: IUserRepository,
  ) { }

  async authenticate(token: string) {
    this.userId = (
      await new checkAuthUsecase(
        this.jwtRepository,
        this.userRepository,
      ).execute(token)
    ).id;

    return this;
  }

  async execute(newWorkspace: NewWorkspace) {
    if (!this.userId) throw new DomainError("unauthenticated", 401);

    return WorkspaceService.create(
      {
        uuid: this.uuidRepository,
        workspace: this.workspaceRespository,
      },
      {
        name: newWorkspace.name,
        description: newWorkspace.description ?? "",
        userId: this.userId,
      },
    );
  }
}
