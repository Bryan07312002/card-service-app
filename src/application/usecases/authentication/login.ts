import { UserService } from "@domain/services/usersService";
import { IHashRepository } from "@domain/repositories/IHashRespository";
import { IUserRepository } from "@domain/repositories/IUsersRepostiry";
import { IJwtRepository } from "@domain/repositories/IJwtRepository";
import { JwtService } from "@domain/services/jwtService";
import { DomainError } from "@domain/error";
import { LoginFormDto } from "@application/dtos/login";

export type TokenPair = {
  access: string;
  refresh: string;
};

export class LoginUsecase {
  constructor(
    private userRepository: IUserRepository,
    private hashRepository: IHashRepository,
    private jwtRepository: IJwtRepository,
  ) {}

  async execute(form: LoginFormDto): Promise<TokenPair> {
    const u = await UserService.filter_one(
      { user: this.userRepository },
      { where: [{ email: form.email }], select: [] },
    );

    const hashedIncomingPassword = await this.hashRepository.hash(
      form.password,
    );

    if (!u.matchPassword(hashedIncomingPassword))
      throw new DomainError({ password: "password doesn't match" }, 401);

    return JwtService.login({ jwt: this.jwtRepository }, u);
  }
}
