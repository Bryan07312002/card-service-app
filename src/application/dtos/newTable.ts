export class NewTable {
  constructor(
    public title: string | undefined,
    public workspaceId: string,
  ) {}

  static isNewTable(obj: unknown): obj is NewTable {
    return true;
  }
}
