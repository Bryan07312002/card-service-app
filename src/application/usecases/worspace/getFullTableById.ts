import { IJwtRepository } from "@domain/repositories/IJwtRepository";
import { IUserRepository } from "@domain/repositories/IUsersRepostiry";
import { Uuid } from "@domain/types";
import { checkAuthUsecase } from "../authentication/checkAuth";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";
import { Table } from "@domain/models/table";
import { Card } from "@domain/models/card";
import { DomainError } from "@domain/error";
import { WorkspaceService } from "@domain/services/workspaceService";
import { ITableRepository } from "@domain/repositories/ITableRepostory";
import { CardService } from "@domain/services/cardService";
import { ICardRepository } from "@domain/repositories/ICardRepository";

type fullTable = Table & { cards: Card[] };

export type FullWorkspace = {
  id: Uuid;
  name: string;
  description: string;
  tables: fullTable[];
};

export class GetFullWorkspaceByUuid {
  userId: Uuid | undefined;

  constructor(
    private workspaceRepository: IWorkspaceRepository,
    private tableRepository: ITableRepository,
    private cardRepository: ICardRepository,
    private userRepository: IUserRepository,
    private jwtRepository: IJwtRepository,
  ) { }

  async authenticate(token: string) {
    this.userId = (
      await new checkAuthUsecase(
        this.jwtRepository,
        this.userRepository,
      ).execute(token)
    ).id;

    return this;
  }

  async execute(id: Uuid): Promise<FullWorkspace> {
    if (!this.userId) throw new DomainError("unauthenticated", 401);

    const workspace = await WorkspaceService.filter_one(
      { workspace: this.workspaceRepository },
      { where: [{ id }], select: [] },
    );

    if (!workspace)
      throw new DomainError({ errors: "workspace does not exists" }, 404);

    const tables: Table[] = (
      await this.tableRepository.paginate(
        { where: [{ workspaceId: workspace.id }], select: [] },
        { page: 1, take: 20 },
      )
    ).data as any;

    const tablesIds = tables.map((el) => ({ id: el.id }));
    const cards: Card[] = (
      await CardService.paginate(
        { card: this.cardRepository },
        { where: tablesIds, select: [] },
        { page: 1, take: 100 },
      )
    ).data as any;

    const fullTables: fullTable[] = [];
    for (const i in tables) {
      const tableId = tables[i].id;
      const filtredCards = cards.filter((el) => el.tableId === tableId);
      fullTables.push({
        id: tables[i].id,
        title: tables[i].title,
        cards: filtredCards,
      } as any);
    }

    return {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      tables: fullTables,
    };
  }
}
