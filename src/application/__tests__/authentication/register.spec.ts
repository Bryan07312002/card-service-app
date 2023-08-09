import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  RegisterUserUsecase,
  RegisterForm,
} from "@application/usecases/authentication/register"; // Import your RegisterUserUseCase and RegisterForm
import { IUserRepository } from "@domain/repositories/IUsersRepostiry";
import { IHashRepository } from "@domain/repositories/IHashRespository";
import { IUuidRepository } from "@domain/repositories/IUuidRepository";
import { User } from "@domain/models/user";
import { UserService } from "@domain/services/usersService";
import { Filter, Args, Paginate } from "@domain/repositories/shared/ICRUD";

// Mock implementations of dependencies
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
    return incomingString;
  }
}

class MockUuidRepository implements IUuidRepository {
  createV4(): `${string}-${string}-${string}-${string}-${string}` {
    return "a-a-a-a-a";
  }
}

describe("RegisterUserUseCase tests", () => {
  let registerUserUseCase: RegisterUserUsecase;
  let mockUserRepository: IUserRepository;
  let mockHashRepository: IHashRepository;
  let mockUuidRepository: IUuidRepository;

  beforeEach(() => {
    // Create mock instances for dependencies
    mockUserRepository = new MockUserRepository();
    mockHashRepository = new MockHashRepository();
    mockUuidRepository = new MockUuidRepository();

    // Create the use case instance
    registerUserUseCase = new RegisterUserUsecase(
      mockUserRepository,
      mockHashRepository,
      mockUuidRepository,
    );
  });

  it("should successfully register a new user", async () => {
    // Create a mock user object
    const user = new User(
      mockUuidRepository.createV4(), // Provide a mock UUID
      "johndoe",
      "john@example.com",
      "secure123",
    );

    // Mock UserService.create to return the user
    UserService.create = jest.fn(async () => user);

    // Define the registration form
    const registrationForm: RegisterForm = {
      username: "johndoe",
      email: "john@example.com",
      password: "secure123",
    };

    // Execute the use case
    const registeredUser = await registerUserUseCase.execute(registrationForm);

    // Assert that UserService.create was called with the correct arguments
    expect(UserService.create).toHaveBeenCalledWith(
      {
        user: mockUserRepository,
        uuid: mockUuidRepository,
        hash: mockHashRepository,
      },
      registrationForm,
    );

    // Assert that the returned user matches the mock user
    expect(registeredUser).toEqual(user);
  });
  // Add more tests as needed for error cases, edge cases, etc.
});
