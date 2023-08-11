import { Uuid } from "@domain/types";
import IBaseModel from "./shared/IBaseModel";
import { DomainError } from "@domain/error";

export class Workspace extends IBaseModel<Workspace> {
  private _id: Uuid;
  private _name: string;
  private _userId: string;
  private _description: string;

  constructor(id: Uuid, name: string, userId: string, description: string) {
    super();
    this._id = id;
    this._name = name;
    this._userId = userId;
    this._description = description;
  }

  serializeFields(): (keyof Workspace)[] {
    return ["id", "name", "userId", "description"];
  }

  // Getter and setter for 'uuid'
  get id(): string {
    return this._id;
  }

  set id(id: Uuid) {
    this._id = id;
  }

  // Getter and setter for 'name'
  get name(): string {
    return this._name;
  }

  set name(name: string) {
    if (name.length < 4) {
      throw new Error("Name must be at least 4 characters.");
    }
    this._name = name;
  }

  // Getter and setter for 'userId'
  get userId(): string {
    return this._userId;
  }

  set userId(userId: string) {
    this._userId = userId;
  }

  // Getter and setter for 'description'
  get description(): string {
    return this._description;
  }

  set description(description: string) {
    this._description = description;
  }
}
