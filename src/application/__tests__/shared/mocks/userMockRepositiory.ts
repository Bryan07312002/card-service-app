import { User } from "@domain/models/user";
import { IUserRepository } from "@domain/repositories/IUsersRepostiry";
import { Args, Filter, Paginate } from "@domain/repositories/shared/ICRUD";

// Mock implementations of dependencies
export class MockUserRepository implements IUserRepository {
  insert(entity: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
  filter_one(filter: Filter<User>): Promise<User> {
    throw new Error("Method not implemented.");
  }
  paginate(filter: Filter<User>, arg: Args): Promise<Paginate<Partial<User>>> {
    throw new Error("Method not implemented.");
  }
}

