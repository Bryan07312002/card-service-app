import {
  IInsert,
  IPaginate,
  IFilterOne,
  IDeleteOne,
  IUpdateOne,
} from "./shared/ICRUD";
import { Card } from "@domain/models/card";

export interface ICardRepository
  extends IInsert<Card>,
    IFilterOne<Card>,
    IPaginate<Card>,
    IDeleteOne<Card>,
    IUpdateOne<Card> {}
