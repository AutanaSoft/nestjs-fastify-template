import { UserEntity } from '@/modules/user/domain/entities';
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { FindUserUseCase, RegisterUserUseCase } from '../../application/use-cases';
import { AuthRepository } from '../../domain/repositories';
import { AuthSignUpData } from '../../domain/types';

/**
 * Authentication repository adapter that coordinates with auth use cases.
 *
 * This adapter implements the AuthRepository interface by delegating operations
 * to the auth module's use cases, which in turn coordinate with user module use cases.
 * This approach follows proper hexagonal architecture with clear separation between
 * auth and user domains while maintaining clean dependency flow.
 *
 * The adapter serves as a bridge between the auth domain repository interface
 * and the auth application layer use cases, ensuring proper architectural boundaries.
 */
@Injectable()
export class AuthUserAdapter extends AuthRepository {
  /**
   * Creates a new AuthUserAdapter instance.
   *
   * @param registerUserUseCase - Use case for user registration
   * @param findUserUseCase - Use case for finding users
   * @param logger - Pino logger for structured logging
   */
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly findUserUseCase: FindUserUseCase,
    private readonly logger: PinoLogger,
  ) {
    super();
    this.logger.setContext(AuthUserAdapter.name);
  }

  /**
   * Registers a new user in the system by delegating to the auth registration use case.
   *
   * This method delegates user registration to the RegisterUserUseCase which coordinates
   * with the user module's CreateUserUseCase for complete registration workflow.
   * All business logic, validation, and error handling is managed by the use cases.
   *
   * @param params - User registration data from auth context
   * @param params.email - User's email address (must be unique across the system)
   * @param params.userName - User's chosen username (must be unique across the system)
   * @param params.password - Plain text password (will be hashed by use case)
   *
   * @returns Promise resolving to the newly created user entity
   *
   * @throws {ConflictError} When email or username already exists
   * @throws {ValidationError} When input data is invalid
   * @throws {InternalServerError} For unexpected errors during user creation
   */
  async register(params: AuthSignUpData): Promise<UserEntity> {
    this.logger.assign({ method: 'register' });
    this.logger.debug('Delegating user registration to RegisterUserUseCase');

    this.logger.assign({ userData: { ...params, password: '[REDACTED]' } });
    this.logger.debug('User registration data prepared');

    // Delegate to RegisterUserUseCase which handles all business logic
    const userDto = await this.registerUserUseCase.execute({ input: params });

    // Convert DTO to entity for the repository interface
    const userEntity: UserEntity = {
      id: userDto.id,
      email: userDto.email,
      userName: userDto.userName,
      password: '', // Password not exposed in DTO for security
      status: userDto.status,
      role: userDto.role,
      createdAt: userDto.createdAt,
      updatedAt: userDto.updatedAt,
    };

    this.logger.assign({ userId: userEntity.id });
    this.logger.debug('User registration completed successfully');

    return userEntity;
  }

  /**
   * Finds a user by email address or username for authentication purposes.
   *
   * This method delegates user lookup to the FindUserUseCase which coordinates
   * with the appropriate user module use cases for email or username search.
   * The use case handles identifier type detection and error management.
   *
   * @param emailOrUserName - The email address or username to search for
   *
   * @returns Promise resolving to:
   *   - UserEntity if a user is found with the given email or username
   *   - null if no user exists with the provided identifier
   */
  async findUser(emailOrUserName: string): Promise<UserEntity | null> {
    this.logger.assign({ method: 'findUser' });
    this.logger.debug('Delegating user lookup to FindUserUseCase');

    this.logger.assign({ emailOrUserName });
    this.logger.debug('Starting user search process');

    // Delegate to FindUserUseCase which handles all search logic
    const user = await this.findUserUseCase.execute(emailOrUserName);

    this.logger.assign({ userFound: !!user, userId: user?.id });
    this.logger.debug('User search completed');

    return user;
  }
}
