export interface IHashRepository {
  salt: string;
  hash(incomingString: string): Promise<string>;
}
