import { User } from "@domain/models/user";
import { IJwtRepository } from "@domain/repositories/IJwtRepository";

export type JwtTokenPair = {
  access: string;
  refresh: string;
};

export class JwtService {
  static login(
    dependencies: { jwt: IJwtRepository },
    user: User,
  ): JwtTokenPair {
    return {
      access: dependencies.jwt.sign({ id: user.id }),
      refresh: dependencies.jwt.sign({ id: user.id, refresh: true }),
    };
  }

  static checkAccess(
    dependencies: { jwt: IJwtRepository },
    token: string,
  ): object {
    const claim = dependencies.jwt.verify(token);
    if ((claim as any)?.refresh) throw "this is not a access token";

    // TODO: check exp
    return claim;
  }

  static checkRefresh(
    dependencies: { jwt: IJwtRepository },
    token: string,
  ): boolean {
    const claim = dependencies.jwt.verify(token);
    if ((claim as any).refresh != undefined && (claim as any).refresh) {
      // TODO: check exp
      return true;
    }

    return false;
  }
}
