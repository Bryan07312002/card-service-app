import { IUserRepository } from "../../../domain/repositories/IUsersRepostiry";
import { User } from "../../../domain/models/user";
import { AbstractCrudRepositoryInMemory } from "./shared/AbstractCrudRepositoryInMemory";

export class UserRepositoryInMemory
  extends AbstractCrudRepositoryInMemory<User>
  implements IUserRepository
{
  tableName: string = "users";
}
