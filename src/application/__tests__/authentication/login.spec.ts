import { describe, fail, it, expect, jest, beforeEach } from "@jest/globals";
import {
  LoginUsecase,
  LoginForm,
  TokenPair,
} from "@application/usecases/authentication/login";
import { IUserRepository } from "@domain/repositories/IUsersRepostiry";
import { IHashRepository } from "@domain/repositories/IHashRespository";
import { IJwtRepository } from "@domain/repositories/IJwtRepository";
import { JwtService } from "@domain/services/jwtService";
import { User } from "@domain/models/user";
import { UserService } from "@domain/services/usersService";
import { Filter, Args, Paginate } from "@domain/repositories/shared/ICRUD";

class MockUserRepository implements IUserRepository {
  insert(entity: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
  filter_one(filter: Filter<User>): Promise<User> {
    throw new Error("Method not implemented.");
  }
  paginate(filter: Filter<User>, arg: Args): Promise<Paginate<Partial<User>>> {
    throw new Error("Method not implemented.");
  }
}

class MockHashRepository implements IHashRepository {
  hash(incomingString: string): string {
    throw new Error("Method not implemented.");
  }
}

class MockJwtRepository implements IJwtRepository {
  sign(payload: object): string {
    throw new Error("Method not implemented.");
  }
  verify(token: string): object {
    throw new Error("Method not implemented.");
  }
}

describe("LoginUsecase tests", () => {
  let loginUsecase: LoginUsecase;
  let mockUserRepository: IUserRepository;
  let mockHashRepository: IHashRepository;
  let mockJwtRepository: IJwtRepository;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockHashRepository = new MockHashRepository();
    mockJwtRepository = new MockJwtRepository();

    loginUsecase = new LoginUsecase(
      mockUserRepository,
      mockHashRepository,
      mockJwtRepository,
    );
  });

  it("should successfully authenticate a user and return token pair", async () => {
    // Create a mock user object
    const user = new User(
      "a-a-a-a-a",
      "johndoe",
      "john@example.com",
      "hashedPassword",
    );

    // Mock UserRepository.filter_one to return the user
    UserService.filter_one = jest.fn(async () => user);

    // Mock HashRepository.hash to return the same hashed password
    mockHashRepository.hash = jest.fn(() => "hashedPassword");

    // Mock User.matchPassword to return true
    user.matchPassword = jest.fn(() => true);

    // Mock JwtService.login to return a token pair
    const tokenPair: TokenPair = {
      access: "accessToken",
      refresh: "refreshToken",
    };
    JwtService.login = jest.fn(() => tokenPair);

    // Define the login form
    const loginForm: LoginForm = {
      email: "john@example.com",
      password: "password123",
    };

    // Execute the use case
    const result = await loginUsecase.execute(loginForm);

    // Assert that UserRepository.filter_one was called with the correct argument
    expect(UserService.filter_one).toHaveBeenCalledWith(
      { user: mockUserRepository },
      { where: [{ email: "john@example.com" }], select: [] },
    );

    // Assert that HashRepository.hash was called with the correct argument
    expect(mockHashRepository.hash).toHaveBeenCalledWith("password123");

    // Assert that User.matchPassword was called with the correct argument
    expect(user.matchPassword).toHaveBeenCalledWith("hashedPassword");

    // Assert that JwtService.login was called with the correct argument
    expect(JwtService.login).toHaveBeenCalledWith(
      { jwt: mockJwtRepository },
      user,
    );

    // Assert that the returned result matches the token pair
    expect(result).toEqual(tokenPair);
  });

  it("should fail authenticate wrong password", async () => {
    // Create a mock user object
    const user = new User(
      "a-a-a-a-a-a",
      "johndoe",
      "john@example.com",
      "hashedPassword",
    );

    // Mock UserRepository.filter_one to return the user
    UserService.filter_one = jest.fn(async () => user);

    // Mock HashRepository.hash to return a different hashed password
    mockHashRepository.hash = jest.fn(() => "differentHashedPassword");

    // Mock User.matchPassword to return false
    user.matchPassword = jest.fn(() => false);

    // Define the login form
    const loginForm: LoginForm = {
      email: "john@example.com",
      password: "incorrectPassword",
    };

    try {
      // Execute the use case
      await loginUsecase.execute(loginForm);
      throw "login should had failed";
    } catch (err) {
      expect(err).toBe("password doesn't match");
    }

    // Assert that UserRepository.filter_one was called with the correct argument
    expect(UserService.filter_one).toHaveBeenCalledWith(
      { user: mockUserRepository },
      { where: [{ email: "john@example.com" }], select: [] },
    );

    // Assert that HashRepository.hash was called with the correct argument
    expect(mockHashRepository.hash).toHaveBeenCalledWith("incorrectPassword");

    // Assert that User.matchPassword was called with the correct argument
    expect(user.matchPassword).toHaveBeenCalledWith("differentHashedPassword");

    // Assert that JwtService.login was not called
    expect(JwtService.login).not.toHaveBeenCalled();
  });
  // Add more tests for different scenarios, such as authentication failure, missing email, etc.
});
