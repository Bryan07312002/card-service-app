import { describe, expect, it } from "@jest/globals";
import { AbstractCrudRepositoryInMemory } from "../shared/AbstractCrudRepositoryInMemory";
import IBaseModel from "@domain/models/shared/IBaseModel";

class FakeMockEntity extends IBaseModel<FakeMockEntity> {
  constructor(
    public id: string,
    public name: string,
  ) {
    super();
  }
}

function createAbstractCrudRepo() {
  return new AbstractCrudRepositoryInMemory<FakeMockEntity>([]);
}

describe("AbstractCrudRepository", () => {
  it("it should insert correctly", async () => {
    // let repo = createAbstractCrudRepo();
    // let entity = new FakeMockEntity(
    //   Math.random().toString(),
    //   Math.random().toString(),
    // );
    //
    // await repo.insert(entity);
    //
    // expect(repo.data.length).toBe(1);
    // expect(repo.data).toContain(entity);
  });
});
