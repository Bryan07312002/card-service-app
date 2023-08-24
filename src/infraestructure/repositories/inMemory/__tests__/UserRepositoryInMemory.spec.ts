import { describe, it, expect } from "@jest/globals";
import { UserRepositoryInMemory } from "../UserRepositoryInMemory";
import { User } from "../../../../domain/models/user";

function createRepository(): UserRepositoryInMemory {
  return new UserRepositoryInMemory({ users: [] });
}

function createTestUser(): User {
  return new User("a-a-a-a-a-a", "testerson", "email@test.com", "akdjaas");
}

function hasOnlyeFields<T>(obj: T, expectedFields: (keyof T)[]): boolean {
  const objectFields = Object.keys(obj as any);

  return (
    objectFields.length === expectedFields.length &&
    objectFields.every((field: any) =>
      expectedFields.includes(field as keyof T),
    )
  );
}

describe("UserRepositoryInMemory", () => {
  it("should insert user", async () => {
    let repo = createRepository();
    let u = createTestUser();

    await repo.insert(u);
    expect(repo.data.users.length).toBe(1);
    expect(repo.data.users).toContain(u);
  });

  it("should insert multiple users", async () => {
    let repo = createRepository();
    let u = createTestUser();

    for (let i = 0; i < 10; i++) {
      await repo.insert(u);
    }
    expect(repo.data.users.length).toBe(10);
    expect(repo.data.users).toContain(u);
  });

  it("should paginate multiple users", async () => {
    let repo = createRepository();
    for (let i = 0; i < 11; i++) {
      repo.data.users.push(createTestUser());
    }
    expect(repo.data.users.length).toBe(11);

    let res = await repo.paginate(
      { select: ["id", "username"], where: [] },
      { take: 10, page: 1 },
    );

    expect(res.data.length).toBe(10);
    expect(res.count).toBe(11);

    // check select
    res.data.forEach((el) => {
      expect(hasOnlyeFields(el, ["id", "username", "email"])).toBe(true);
    });
  });
});
