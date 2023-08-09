export interface IJwtRepository {
  sign(payload: object): string;
  verify(token: string): object;
}
