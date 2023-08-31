import { IInsert, IPaginate, IFilterOne } from "./shared/ICRUD";
import { User } from "../models/user";

export interface IUserRepository
  extends IInsert<User>,
    IFilterOne<User>,
    IPaginate<User> {}
