import { UpdateCardDto } from "@application/dtos/updateCard";
import { describe, beforeEach, expect, it } from "@jest/globals";
import { UpdateCardUsecase } from "@application/usecases/card/updateCard";
import { MockCardRepository } from "@application/__tests__/shared/mocks/cardMockRepository";
import { MockJwtRepository } from "@application/__tests__/shared/mocks/jwtMockRepository";
import { MockTableRepository } from "@application/__tests__/shared/mocks/tableMockRepository";
import { MockUserRepository } from "@application/__tests__/shared/mocks/userMockRepositiory";
import { User } from "@domain/models/user";
import { Table } from "@domain/models/table";
import { DomainError } from "@domain/error";
import { MockWorkspaceRepository } from "../shared/mocks/workspaceMockRepository";
import { Card } from "@domain/models/card";
import { Workspace } from "@domain/models/workspace";

describe('create card usecase', () => {
  const cardMockRepository = new MockCardRepository();
  const jwtMockRepository = new MockJwtRepository("secret");
  const userMockRepository = new MockUserRepository();
  const workspaceMockRepository = new MockWorkspaceRepository();
  const tableMockRepository = new MockTableRepository();

  let cardDto: UpdateCardDto;
  let usecase: UpdateCardUsecase;

  beforeEach(async () => {
    userMockRepository.filter_one = async () => new User(
      "fakeuserUuid-1-1-1-1-1-1",
      "fakeUsername",
      "fakeEmail@email.com",
      "fakePassowrd",
    );
    workspaceMockRepository.filter_one = async () => new Workspace(
      "fakeworkspaceUuid-1-1-1-1-1-1",
      'name',
      "fakeuserUuid-1-1-1-1-1-1",
      'decription'
    );
    tableMockRepository.filter_one = async () => new Table(
      "faketableUuid-1-1-1-1-1-1",
      "table title",
      "fakeworkspaceUuid-1-1-1-1-1-1",
    );
    cardMockRepository.update = async () => { };
    cardMockRepository.filter_one = async () => new Card(
      "fakecardUuid-1-1-1-1-1-1",
      "cardTitle",
      "description",
      "faketableUuid-1-1-1-1-1-1",
      new Date(),
      new Date()
    );
    jwtMockRepository.verify = () => ({ id: "fakeuserUuid-1-1-1-1-1-1" });

    usecase = await new UpdateCardUsecase(
      cardMockRepository,
      jwtMockRepository,
      userMockRepository,
      workspaceMockRepository,
      tableMockRepository,
    ).authenticate("fakeToken");

    cardDto = new UpdateCardDto(
      'title 1',
      "this is a description",
    );
  });

  it("should create card correctly", async () => {
    let wasUpdateCalled = false;
    cardMockRepository.update = async () => { wasUpdateCalled = true };

    const res = await usecase.execute("fakecardUuid-1-1-1-1-1-1", cardDto);

    expect(res).toBe(undefined);
    expect(wasUpdateCalled).toBe(true);
  });

  it("should not create card to inexisting table", async () => {
    tableMockRepository.filter_one = async () => null;
    try {
      await usecase.execute('fakecardUuid-1-1-1-1-1-1', cardDto);
      throw 'should not get here'
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      expect((e as DomainError).code).toBe(422)
    }
  });

  it("should not create card not authenticated", async () => {
    try {
      await new UpdateCardUsecase(
        cardMockRepository,
        jwtMockRepository,
        userMockRepository,
        workspaceMockRepository,
        tableMockRepository,
      )
        .execute('a-a-a-a-a', cardDto);

      throw 'should not get here'
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      expect((e as DomainError).code).toBe(401)
    }
  });
});

