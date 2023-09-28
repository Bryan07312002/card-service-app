import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { RegisterUserUsecase } from "@application/usecases/authentication/register";
import { RegisterFormDto } from "@application/dtos/registerForm";
import { IUserRepository } from "@domain/repositories/IUsersRepostiry";
import { IHashRepository } from "@domain/repositories/IHashRespository";
import { IUuidRepository } from "@domain/repositories/IUuidRepository";
import { User } from "@domain/models/user";
import { UserService } from "@domain/services/usersService";
import { MockUuidRepository } from "@application/__tests__/shared/mocks/uuidMockRepository";
import { MockHashRepository } from "@application/__tests__/shared/mocks/hashMockRepository";
import { MockUserRepository } from "@application/__tests__/shared/mocks/userMockRepositiory";

describe("RegisterUserUseCase tests", () => {
  let registerUserUseCase: RegisterUserUsecase;
  let mockUserRepository: IUserRepository;
  let mockHashRepository: IHashRepository;
  let mockUuidRepository: IUuidRepository;

  beforeEach(() => {
    // Create mock instances for dependencies
    mockUserRepository = new MockUserRepository();
    mockHashRepository = new MockHashRepository('');
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
    const registrationForm: RegisterFormDto = {
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
