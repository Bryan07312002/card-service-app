import { AbstractCrudRepositoryInMemory } from "./shared/AbstractCrudRepositoryInMemory";
import { Table } from "@domain/models/table";
import { ITableRepository } from "@domain/repositories/ITableRepostory";

export class TableRepositoryInMemory
  extends AbstractCrudRepositoryInMemory<Table>
  implements ITableRepository {
  tableName: string = 'tables'
}
