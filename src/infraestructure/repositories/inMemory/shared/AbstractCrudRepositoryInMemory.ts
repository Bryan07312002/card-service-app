import {
  IInsert,
  IPaginate,
  IFilterOne,
  Args,
  Filter,
  Paginate,
  IDeleteOne,
  IUpdateOne,
} from "@domain/repositories/shared/ICRUD";
import IBaseModel from "@domain/models/shared/IBaseModel";
import { DomainError } from "@domain/error";

export class AbstractCrudRepositoryInMemory<E extends IBaseModel<E>>
  implements
    IInsert<E>,
    IPaginate<E>,
    IFilterOne<E>,
    IDeleteOne<E>,
    IUpdateOne<E>
{
  constructor(public data: E[]) {}

  Update(filter: Filter<E>, newData: Partial<E>): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(filter: Filter<E>): Promise<void> {
    const result = this.data.findIndex((obj) =>
      filter.where.every((criteria) => this.customFilter(obj, criteria)),
    );
    if (result < 0) throw new DomainError("resource not found", 422);
    else this.data.splice(result, 1);

    return;
  }

  customFilter(obj: E, criteria: Partial<E>): boolean {
    for (const key in criteria) {
      if (obj[key as keyof E] === criteria[key]) {
        return true;
      }
    }
    return false;
  }

  async filter_one(filter: Filter<E>): Promise<E> {
    const result = this.data.find((obj) =>
      filter.where.every((criteria) => this.customFilter(obj, criteria)),
    );

    if (result) return result;
    else throw "error entity not found";
  }

  filterFieldsFromArray<T extends IBaseModel<T>>(
    dataArray: T[],
    fieldsArray: string[],
  ): T[] {
    return dataArray.map((item) => {
      const filteredObject: any = {};
      for (const field of fieldsArray) {
        if (item.serializeFields().includes(field as keyof T)) {
          filteredObject[field] = item[field as keyof T];
        }
      }
      return filteredObject;
    });
  }

  async paginate(filter: Filter<E>, arg: Args): Promise<Paginate<Partial<E>>> {
    const indexStart = (arg.page - 1) * arg.take;
    const indexEnd = indexStart + arg.take;
    const data = this.filterFieldsFromArray(
      this.data.slice(indexStart, indexEnd),
      filter.select as any,
    );

    return {
      data,
      page: arg.page,
      count: this.data.length,
    };
  }

  async insert(entity: E): Promise<E> {
    this.data.push(entity);
    return entity;
  }
}
