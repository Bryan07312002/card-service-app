import { IUserRepository } from "../repositories/IUsersRepostiry";
import { IUuidRepository } from "../repositories/IUuidRepository";
import { IHashRepository } from "../repositories/IHashRespository";
import { Paginate, Filter, Args } from "../repositories/shared/ICRUD";
import { NewUser } from "../types";
import { User } from "../models/user";

export class UserService {
  static async create(
    dependencies: {
      user: IUserRepository;
      hash: IHashRepository;
      uuid: IUuidRepository;
    },
    userDto: NewUser,
  ): Promise<User> {
    const user = new User(
      dependencies.uuid.createV4(),
      userDto.username,
      userDto.email,
      userDto.password,
    );
    user.password = await dependencies.hash.hash(userDto.password);

    return await dependencies.user.insert(user);
  }

  static async paginate(
    dependencies: {
      user: IUserRepository;
    },
    filter: Filter<Omit<User, "password">>,
    args: Args,
  ): Promise<Paginate<Omit<Partial<User>, "password">>> {
    return await dependencies.user.paginate(filter, args);
  }

  static async filter_one(
    dependencies: { user: IUserRepository },
    filter: Filter<User>,
  ): Promise<User | null> {
    return await dependencies.user.filter_one(filter);
  }
}
