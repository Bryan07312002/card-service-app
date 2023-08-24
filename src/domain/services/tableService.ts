import { IUuidRepository } from "../repositories/IUuidRepository";
import { ITableRepository } from "@domain/repositories/ITableRepostory";
import { Table } from "@domain/models/table";
// import { Paginate, Filter, Args } from "../repositories/shared/ICRUD";

type NewTable = {
  title: string | null,
  workspaceId: string,
}

export class TableService {
  static async create(
    dependencies: {
      uuid: IUuidRepository,
      table: ITableRepository,
    },
    dto: NewTable,
  ): Promise<Table> {
    const table = new Table(
      dependencies.uuid.createV4(),
      dto.title || '',
      dto.workspaceId
    )

    return dependencies.table.insert(table);
  }
}
