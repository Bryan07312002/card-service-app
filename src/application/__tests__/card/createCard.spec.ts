import { describe, it, beforeEach, beforeAll, expect } from "@jest/globals";
import { CreateCardUsecase } from "@application/usecases/card/createCard";
import { NewCardDto } from "@application/dtos/NewCard";
import { MockCardRepository } from "@application/__tests__/shared/mocks/cardMockRepository";
import { MockUuidRepository } from "@application/__tests__/shared/mocks/uuidMockRepository";
import { MockJwtRepository } from "@application/__tests__/shared/mocks/jwtMockRepository";
import { MockTableRepository } from "@application/__tests__/shared/mocks/tableMockRepository";
import { MockUserRepository } from "@application/__tests__/shared/mocks/userMockRepositiory";
import { User } from "@domain/models/user";
import { Table } from "@domain/models/table";
import { DomainError } from "@domain/error";

describe('create card usecase', () => {
  const cardMockRepository = new MockCardRepository();
  const jwtMockRepository = new MockJwtRepository("secret");
  const userMockRepository = new MockUserRepository();
  const tableMockRepository = new MockTableRepository();
  const uuidMockRepository = new MockUuidRepository();

  let cardDto: NewCardDto;
  let usecase: CreateCardUsecase;

  beforeEach(async () => {
    userMockRepository.filter_one = async () => new User(
      "fakeUuid-1-1-1-1-1-1",
      "fakeUsername",
      "fakeEmail@email.com",
      "fakePassowrd",
    );
    tableMockRepository.filter_one = async () => new Table(
      "a-a-a-a-a",
      "table title",
      "a-a-a-a-xa",
    );
    cardMockRepository.insert = async (card) => card;
    jwtMockRepository.verify = () => ({ id: "fakeUuid" });

    usecase = await new CreateCardUsecase(
      cardMockRepository,
      uuidMockRepository,
      jwtMockRepository,
      userMockRepository,
      tableMockRepository
    )
      .authenticate("fakeToken");

    cardDto = new NewCardDto(
      'title 1',
      "this is a description",
      "a-a-a-a-a"
    );
  });

  it("should create card correctly", async () => {
    const card = await usecase.execute(cardDto);

    expect(card.title).toBe(cardDto.title);
    expect(card.description).toBe(cardDto.description);
    expect(card.tableId).toBe(cardDto.tableId);
    expect(card.id).toBeDefined();
  });

  it("should not create card to inexisting", async () => {
    tableMockRepository.filter_one = async () => null;
    try {
      await usecase.execute(cardDto);
      throw 'should not get here'
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      expect((e as DomainError).code).toBe(422)
    }
  });

  it("should not create card not authenticated", async () => {
    try {
      await new CreateCardUsecase(
        cardMockRepository,
        uuidMockRepository,
        jwtMockRepository,
        userMockRepository,
        tableMockRepository
      )
        .execute(cardDto);

      throw 'should not get here'
    } catch (e) {
      expect(e).toBeInstanceOf(DomainError);
      expect((e as DomainError).code).toBe(401)
    }
  });
});
