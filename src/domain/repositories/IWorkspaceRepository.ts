import {
  IInsert,
  IPaginate,
  IFilterOne,
  IDeleteOne,
  IUpdateOne,
} from "./shared/ICRUD";
import { Workspace } from "../models/workspace";

export interface IWorkspaceRepository
  extends IInsert<Workspace>,
    IFilterOne<Workspace>,
    IPaginate<Workspace>,
    IDeleteOne<Workspace>,
    IUpdateOne<Workspace> {}
