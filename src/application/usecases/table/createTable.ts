import { IUuidRepository } from "@domain/repositories/IUuidRepository";
import { ITableRepository } from "@domain/repositories/ITableRepostory";
import { IUserRepository } from "@domain/repositories/IUsersRepostiry";
import { IJwtRepository } from "@domain/repositories/IJwtRepository";
import { checkAuthUsecase } from "../authentication/checkAuth";
import { Uuid } from "@domain/types";
import { DomainError } from "@domain/error";
import { TableService } from "@domain/services/tableService";
import { NewTable } from "@application/dtos/newTable";
import { Table } from "@domain/models/table";

export class CreateTableUsecase {
  userId: Uuid | undefined;

  constructor(
    private tableRepository: ITableRepository,
    private uuidRepository: IUuidRepository,
    private userRepository: IUserRepository,
    private jwtRepository: IJwtRepository,
  ) {}

  async authenticate(token: string): Promise<CreateTableUsecase> {
    this.userId = (
      await new checkAuthUsecase(
        this.jwtRepository,
        this.userRepository,
      ).execute(token)
    ).id;

    return this;
  }

  async execute(newTable: NewTable): Promise<Table> {
    if (!this.userId) throw new DomainError("unauthenticated", 401);

    return TableService.create(
      { uuid: this.uuidRepository, table: this.tableRepository },
      { ...newTable, title: newTable.title ?? null },
    );
  }
}
