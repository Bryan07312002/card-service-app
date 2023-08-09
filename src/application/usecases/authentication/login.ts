import { UserService } from "@domain/services/usersService";
import { IHashRepository } from "@domain/repositories/IHashRespository";
import { IUserRepository } from "@domain/repositories/IUsersRepostiry";
import { IJwtRepository } from "@domain/repositories/IJwtRepository";
import { JwtService } from "@domain/services/jwtService";

export type LoginForm = {
  username?: string;
  email?: string;
  password: string;
};

export type TokenPair = {
  access: string;
  refresh: string;
};

export class LoginUsecase {
  constructor(
    private userRepository: IUserRepository,
    private hashRepository: IHashRepository,
    private jwtRepository: IJwtRepository,
  ) { }

  async execute(form: LoginForm): Promise<TokenPair> {
    if (!form.email) throw "error email not sent";
    const u = await UserService.filter_one(
      { user: this.userRepository },
      { where: [{ email: form.email }], select: [] },
    );

    const hashedIncomingPassword = this.hashRepository.hash(form.password);
    if (!u.matchPassword(hashedIncomingPassword))
      throw "password doesn't match";

    return JwtService.login({ jwt: this.jwtRepository }, u);
  }
}
