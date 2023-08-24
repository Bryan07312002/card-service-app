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
  tableName = '';

  constructor(public data: any) { }

  Update(filter: Filter<E>, newData: Partial<E>): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(filter: Filter<E>): Promise<void> {
    const result = this.data[this.tableName].findIndex((obj: E) =>
      filter.where.every((criteria) => this.customFilter(obj, criteria)),
    );
    if (result < 0) throw new DomainError("resource not found", 422);
    else this.data[this.tableName].splice(result, 1);

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

  async filter_one(filter: Filter<E>): Promise<E | null> {
    const result = this.data[this.tableName].find((obj: E) =>
      filter.where.every((criteria) => this.customFilter(obj, criteria)),
    );

    if (result) return result;
    else return null
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
    const data = this.data[this.tableName]
      .slice(indexStart, indexEnd)
      .map((el: E) => el.toJson() as E);

    return {
      data,
      page: arg.page,
      count: this.data[this.tableName].length,
    };
  }

  async insert(entity: E): Promise<E> {
    this.data[this.tableName].push(entity);
    return entity;
  }
}
