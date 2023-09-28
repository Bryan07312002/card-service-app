import { Table } from "@domain/models/table";
import { ITableRepository } from "@domain/repositories/ITableRepostory";
import { Filter, Args, Paginate } from "@domain/repositories/shared/ICRUD";

export class MockTableRepository implements ITableRepository {
  insert(_: Table): Promise<Table> {
    throw new Error("Method not implemented.");
  }
  filter_one(_: Filter<Table>): Promise<Table | null> {
    throw new Error("Method not implemented.");
  }
  paginate(_: Filter<Table>, __: Args): Promise<Paginate<Partial<Table>>> {
    throw new Error("Method not implemented.");
  }
  delete(_: Filter<Table>): Promise<void> {
    throw new Error("Method not implemented.");
  }
  update(_: Filter<Table>, __: Partial<Table>): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
