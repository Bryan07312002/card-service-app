import { DomainError } from "@domain/error";
import { IJwtRepository } from "@domain/repositories/IJwtRepository";
import { IUserRepository } from "@domain/repositories/IUsersRepostiry";
import { JwtService } from "@domain/services/jwtService";
import { Uuid } from "@domain/types";

export class checkAuthUsecase {
  constructor(
    private jwtRepository: IJwtRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(token: string) {
    const claim: any = JwtService.checkAccess(
      { jwt: this.jwtRepository },
      token,
    );

    const isUserIdExists: boolean = !!(await this.userRepository.filter_one({
      where: [{ id: claim.id as Uuid }],
      select: [],
    }));

    if (!isUserIdExists) throw new DomainError({ token: "invalid token" }, 401);

    return claim;
  }
}
