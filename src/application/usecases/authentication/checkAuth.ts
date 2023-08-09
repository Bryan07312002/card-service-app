import { IJwtRepository } from "@domain/repositories/IJwtRepository";
import { JwtService } from "@domain/services/jwtService";

export class checkAuthUsecase {
  constructor(private jwtRepository: IJwtRepository) { }

  execute(token: string): boolean {
    return JwtService.checkAccess({ jwt: this.jwtRepository }, token);
  }
}
