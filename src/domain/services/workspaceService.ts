import { IWorkspaceRepository } from "../repositories/IWorkspaceRepository";
import { IUuidRepository } from "../repositories/IUuidRepository";
import { Paginate, Filter, Args } from "../repositories/shared/ICRUD";
import { NewWorkspace } from "../types";
import { Workspace } from "../models/workspace";

export class WorkspaceService {
  static async create(
    dependencies: {
      workspace: IWorkspaceRepository;
      uuid: IUuidRepository;
    },
    workspaceDto: NewWorkspace,
  ): Promise<Workspace> {
    // TODO: validation
    const workspace = new Workspace(
      dependencies.uuid.createV4(),
      workspaceDto.name,
      workspaceDto.userId,
      workspaceDto.description,
    );
    return await dependencies.workspace.insert(workspace);
  }

  static async paginate(
    dependencies: {
      workspace: IWorkspaceRepository;
    },
    filter: Filter<Workspace>,
    args: Args,
  ): Promise<Paginate<Partial<Workspace>>> {
    return await dependencies.workspace.paginate(filter, args);
  }

  static async filter_one(
    dependencies: { workspace: IWorkspaceRepository },
    filter: Filter<Workspace>,
  ): Promise<Workspace> {
    return await dependencies.workspace.filter_one(filter);
  }

  static async delete_one(
    dependencies: { workspace: IWorkspaceRepository },
    filter: Filter<Workspace>,
  ): Promise<void> {
    return dependencies.workspace.delete(filter);
  }

  static async update_one(
    dependencies: { workspace: IWorkspaceRepository },
    filter: Filter<Workspace>,
    newData: Partial<Workspace>,
  ): Promise<void> {
    return dependencies.workspace.Update(filter, newData);
  }
}
