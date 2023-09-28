import { Workspace } from "@domain/models/workspace";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";
import { Filter, Args, Paginate } from "@domain/repositories/shared/ICRUD";

export class MockWorkspaceRepository implements IWorkspaceRepository {
  insert(_: Workspace): Promise<Workspace> {
    throw new Error("Method not implemented.");
  }
  filter_one(_: Filter<Workspace>): Promise<Workspace | null> {
    throw new Error("Method not implemented.");
  }
  paginate(_: Filter<Workspace>, __: Args): Promise<Paginate<Partial<Workspace>>> {
    throw new Error("Method not implemented.");
  }
  delete(_: Filter<Workspace>): Promise<void> {
    throw new Error("Method not implemented.");
  }
  update(_: Filter<Workspace>, __: Partial<Workspace>): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
