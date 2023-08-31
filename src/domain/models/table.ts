import { Uuid } from "@domain/types";
import IBaseModel from "@domain/models/shared/IBaseModel";

export class Table extends IBaseModel<Table> {
  private _id: string;
  private _title!: string;
  private _workspaceId!: string;

  constructor(id: Uuid, title: string, workspaceId: string) {
    super();
    this._id = id;
    this.title = title; // Using the setter for title
    this.workspaceId = workspaceId; // Using the setter for workspaceId
  }

  serializeFields(): (keyof Table)[] {
    return ["id", "title", "workspaceId"];
  }

  // Getter for id
  get id(): string {
    return this._id;
  }

  // Getter and setter for title
  get title(): string {
    return this._title;
  }

  set title(newTitle: string) {
    this._title = newTitle;
  }

  // Getter and setter for workspaceId
  get workspaceId(): string {
    return this._workspaceId;
  }

  set workspaceId(workspaceId: string) {
    this._workspaceId = workspaceId;
  }
}
