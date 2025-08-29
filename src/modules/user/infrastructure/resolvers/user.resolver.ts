import {
  UserCreateArgsDto,
  UserDto,
  UserFindArgsDto,
  UserUpdateArgsDto,
} from '@modules/user/application/dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateUserUseCase,
  FindUserByEmailUseCase,
  FindUsersUseCase,
  UpdateUserUseCase,
} from '../../application/use-cases';

/**
 * GraphQL resolver for User entity operations.
 * Handles user-related queries and mutations through the application layer.
 */
@Resolver(() => UserDto)
export class UserResolver {
  /**
   * Initializes the UserResolver with required use cases.
   * @param createUserUseCase Use case for creating new users
   * @param findUsersUseCase Use case for finding and retrieving users
   * @param updateUserUseCase Use case for updating existing users
   * @param findUserByEmailUseCase Use case for finding a user by email address
   */
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findUsersUseCase: FindUsersUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
  ) {}

  /**
   * Creates a new user account with the provided data.
   * Validates input data and delegates creation to the application layer.
   * @param params User creation arguments containing required user data
   * @returns Promise resolving to the created user data
   * @throws ConflictException when validation fails
   * @throws ConflictException when user already exists
   */
  @Mutation(() => UserDto, { description: 'Creates a new user account with the provided data' })
  async create(@Args() params: UserCreateArgsDto): Promise<UserDto> {
    return await this.createUserUseCase.execute(params);
  }

  /**
   * Updates an existing user account with the provided data.
   * Validates input data and delegates update to the application layer.
   * @param params User update arguments containing required user data
   * @returns Promise resolving to the updated user data
   * @throws ConflictException when validation fails
   * @throws NotFoundException when user does not exist
   */
  @Mutation(() => UserDto, {
    description: 'Updates an existing user account with the provided data',
  })
  async update(@Args() params: UserUpdateArgsDto): Promise<UserDto> {
    return await this.updateUserUseCase.execute(params);
  }

  /**
   * Retrieves users based on optional filter and sort criteria.
   * Supports pagination, filtering, and sorting through query parameters.
   * @param params Query parameters for filtering and sorting users
   * @returns Promise resolving to an array of user data matching the criteria
   */
  @Query(() => [UserDto], {
    description: 'Retrieves users based on optional filter and sort criteria',
  })
  async findAll(@Args() params: UserFindArgsDto): Promise<UserDto[]> {
    return await this.findUsersUseCase.execute(params);
  }

  /**
   * Finds a user by their email address.
   * Validates the email parameter and delegates search to the application layer.
   * @param email The email address to search for
   * @returns Promise resolving to the user data if found
   * @throws NotFoundException when user with given email does not exist
   * @throws BadRequestException when email parameter is invalid
   */
  @Query(() => UserDto, {
    description: 'Finds a user by their email address',
  })
  async findByEmail(
    @Args('email', { type: () => String, description: 'Email address to search for' })
    email: string,
  ): Promise<UserDto> {
    return await this.findUserByEmailUseCase.execute(email);
  }
}
