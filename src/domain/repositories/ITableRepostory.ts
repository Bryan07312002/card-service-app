import {
  IInsert,
  IPaginate,
  IFilterOne,
  IDeleteOne,
  IUpdateOne,
} from "./shared/ICRUD";
import { Table } from "../models/table";

export interface ITableRepository
  extends IInsert<Table>,
    IFilterOne<Table>,
    IPaginate<Table>,
    IDeleteOne<Table>,
    IUpdateOne<Table> {}
