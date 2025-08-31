import {
  UserCreateArgsDto,
  UserDto,
  UserFindByEmailArgsDto,
  UserFindByIdArgsDto,
  UserFindByUserNameArgsDto,
  UserFindPaginatedArgsDto,
  UserPaginatedResponseDto,
  UserUpdateArgsDto,
} from '@modules/user/application/dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PinoLogger } from 'nestjs-pino';
import {
  CreateUserUseCase,
  FindUserByEmailUseCase,
  FindUserByIdUseCase,
  FindUserByUsernameUseCase,
  FindUsersPaginatedUseCase,
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
   * @param logger Logger instance for logging
   * @param createUserUseCase Use case for creating new users
   * @param updateUserUseCase Use case for updating existing users
   * @param findUsersUseCase Use case for finding and retrieving users
   * @param findUsersPaginatedUseCase Use case for finding and retrieving users with pagination
   * @param findUserByIdUseCase Use case for finding a user by ID
   * @param findUserByEmailUseCase Use case for finding a user by email address
   * @param findUserByUsernameUseCase Use case for finding a user by username
   */
  constructor(
    private readonly logger: PinoLogger,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findUsersPaginatedUseCase: FindUsersPaginatedUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly findUserByUsernameUseCase: FindUserByUsernameUseCase,
  ) {
    this.logger.setContext(UserResolver.name);
  }

  /**
   * Creates a new user account with the provided data.
   * Validates input data and delegates creation to the application layer.
   * @param params User creation arguments containing required user data
   * @returns Promise resolving to the created user data
   * @throws ConflictException when validation fails
   * @throws ConflictException when user already exists
   */
  @Mutation(() => UserDto, { description: 'Creates a new user account with the provided data' })
  async createUser(@Args() params: UserCreateArgsDto): Promise<UserDto> {
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
  async updateUser(@Args() params: UserUpdateArgsDto): Promise<UserDto> {
    return await this.updateUserUseCase.execute(params);
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
  async findUserByEmail(@Args() params: UserFindByEmailArgsDto): Promise<UserDto> {
    this.logger.assign({ method: 'findUserByEmail', query: params });
    this.logger.debug('Search for user by email address received');
    return await this.findUserByEmailUseCase.execute(params);
  }

  /**
   * Finds a user by their unique identifier.
   * Validates the ID parameter through DTO and delegates search to the application layer.
   * @param params Arguments containing the user ID to search for
   * @returns Promise resolving to the user data if found
   * @throws NotFoundException when user with given ID does not exist
   * @throws BadRequestException when ID parameter is invalid
   */
  @Query(() => UserDto, {
    description: 'Finds a user by their unique identifier',
  })
  async findUser(@Args() params: UserFindByIdArgsDto): Promise<UserDto> {
    return await this.findUserByIdUseCase.execute(params);
  }

  /**
   * Finds a user by their username.
   * Validates the username parameter through DTO and delegates search to the application layer.
   * @param params Arguments containing the username to search for
   * @returns Promise resolving to the user data if found
   * @throws NotFoundException when user with given username does not exist
   * @throws BadRequestException when username parameter is invalid
   */
  @Query(() => UserDto, {
    description: 'Finds a user by their username',
  })
  async findUserByUsername(@Args() params: UserFindByUserNameArgsDto): Promise<UserDto> {
    return await this.findUserByUsernameUseCase.execute(params);
  }

  /**
   * Finds and retrieves users with pagination support based on optional filter and sort criteria.
   * Supports pagination, filtering, and sorting through query parameters.
   * Returns paginated results with metadata including total count and page information.
   * @param params Query parameters for pagination, filtering and sorting users
   * @returns Promise resolving to paginated user data with pagination metadata
   */
  @Query(() => UserPaginatedResponseDto, {
    description:
      'Finds and retrieves users with pagination support based on optional filter and sort criteria',
  })
  async findUsersPaginated(
    @Args() params: UserFindPaginatedArgsDto,
  ): Promise<UserPaginatedResponseDto> {
    return await this.findUsersPaginatedUseCase.execute(params);
  }
}
