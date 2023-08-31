import { Uuid } from "@domain/types";
import IBaseModel from "@domain/models/shared/IBaseModel";

export class Card extends IBaseModel<Card> {
  private _id: Uuid;
  private _title!: string;
  private _description!: string;
  private _tableId!: Uuid;
  private _createdAt!: Date;
  private _updatedAt!: Date;

  constructor(
    id: Uuid,
    title: string,
    description: string,
    tableId: Uuid,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this._id = id;
    this.title = title;
    this.description = description;
    this.tableId = tableId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  serializeFields(): (keyof Card)[] {
    return ["id", "title", "description", "tableId", "createdAt", "updatedAt"];
  }

  // Getter and setter for 'id'
  get id(): string {
    return this._id;
  }

  // Getter and setter for 'workspaceId'
  get tableId(): Uuid {
    return this._tableId;
  }

  set tableId(id: Uuid) {
    this._tableId = id;
    this._updatedAt = new Date();
  }

  // Getter and setter for 'title'
  get title(): string {
    return this._title;
  }

  set title(title: string) {
    this._title = title;
    this._updatedAt = new Date();
  }

  // Getter and setter for 'description'
  get description(): string {
    return this._description;
  }

  set description(description: string) {
    this._description = description;
    this._updatedAt = new Date();
  }

  // Getter and setter for 'createdAt'
  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(createdAt: Date) {
    this._createdAt = createdAt;
  }

  // Getter and setter for 'updatedAt'
  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this._updatedAt = updatedAt;
  }
}
