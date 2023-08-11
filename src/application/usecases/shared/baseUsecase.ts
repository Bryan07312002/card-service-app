import { Uuid } from "@domain/types";

export type UsecaseContext = {
  userId?: Uuid;
};

export abstract class BaseUsecase {
  context: UsecaseContext;

  constructor() {
    this.context = {};
  }
}
