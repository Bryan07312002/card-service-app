import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";
import { Workspace } from "@domain/models/workspace";
import { AbstractCrudRepositoryInMemory } from "./shared/AbstractCrudRepositoryInMemory";

export class WorkspaceRepositoryInMemory
  extends AbstractCrudRepositoryInMemory<Workspace>
  implements IWorkspaceRepository {}
