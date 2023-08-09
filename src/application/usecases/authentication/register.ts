import { UserService } from "@domain/services/usersService";
import { IHashRepository } from "@domain/repositories/IHashRespository";
import { IUuidRepository } from "@domain/repositories/IUuidRepository";
import { IUserRepository } from "@domain/repositories/IUsersRepostiry";
import { User } from "@domain/models/user";

export type RegisterForm = {
  username: string;
  email: string;
  password: string;
};

export class RegisterUserUsecase {
  constructor(
    private userRepository: IUserRepository,
    private hashRepository: IHashRepository,
    private uuidRepository: IUuidRepository,
  ) { }

  async execute(form: RegisterForm): Promise<User> {
    return await UserService.create(
      {
        user: this.userRepository,
        uuid: this.uuidRepository,
        hash: this.hashRepository,
      },
      form,
    );
  }
}
