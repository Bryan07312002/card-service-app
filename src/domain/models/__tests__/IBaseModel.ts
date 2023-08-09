import { describe, expect, it } from "@jest/globals";
import IBaseModel from "../shared/IBaseModel";

class MockFakeEntity extends IBaseModel {
  private _field1: string;
  private _field2: number;

  constructor(field1: string, field2: number) {
    super();
    this._field1 = field1;
    this._field2 = field2;
  }

  get field1(): string {
    return this._field1;
  }

  set field1(value: string) {
    this._field1 = value;
  }

  get field2(): number {
    return this._field2;
  }

  set field2(value: number) {
    this._field2 = value;
  }

  serializeFields(): (keyof this)[] {
    return ["field1", "field2"];
  }
}

describe("IBaseModel", () => {
  it("should recive correct json", () => {
    const obj = new MockFakeEntity("test1", 21);

    expect(obj.toJson()).toMatchObject({ field1: "test1", field2: 21 });
  });
});
