import {
  IInsert,
  IPaginate,
  IFilterOne,
  Args,
  Filter,
  Paginate,
} from "@domain/repositories/shared/ICRUD";
import IBaseModel from "@domain/models/shared/IBaseModel";

export class AbstractCrudRepositoryInMemory<E extends IBaseModel>
  implements IInsert<E>, IPaginate<E>, IFilterOne<E>
{
  data: E[] = [];

  async filter_one(filter: Filter<E>): Promise<E> {
    let result = this.data.filter((e) => {
      if (e != filter) {
        return false;
      }

      return true;
    });

    if (result.length > 0) return result[0];
    else throw "error entity not found";
  }

  filterFieldsFromArray<T extends IBaseModel>(
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
