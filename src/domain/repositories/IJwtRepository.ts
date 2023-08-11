export interface IJwtRepository {
  secret: string;
  sign(payload: object): string;
  verify(token: string): object;
}
