import { UserDto } from '@/modules/user/application/dto';
import { CreateUserUseCase } from '@/modules/user/application/use-cases';
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { SignUpArgsDto } from '../dto/args';

/**
 * Use case for user registration through the authentication system.
 *
 * This use case orchestrates the user registration process by coordinating
 * between the auth repository adapter and any additional business logic
 * required during user signup. It handles the complete registration workflow
 * while maintaining separation between application and domain concerns.
 *
 * The use case serves as the entry point for user registration from the
 * infrastructure layer (controllers, resolvers) and encapsulates all
 * business rules related to the signup process.
 */
@Injectable()
export class RegisterUserUseCase {
  /**
   * Creates a new RegisterUserUseCase instance.
   *
   * @param createUserUseCase - Use case for creating users
   * @param logger - Pino logger for structured logging
   */
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(RegisterUserUseCase.name);
  }

  /**
   * Executes the user registration process.
   *
   * This method coordinates the complete user registration workflow:
   * 1. Validates the registration data (handled by repository/domain)
   * 2. Creates the user account through the auth repository
   * 3. Handles any post-registration business logic
   *
   * The method delegates the actual user creation to the auth repository,
   * which in turn uses the user repository for persistence operations.
   * This ensures consistent user creation logic across the application.
   *
   * @param params - User registration information
   * @param registrationData.email - User's email address (must be unique)
   * @param registrationData.userName - User's chosen username (must be unique)
   * @param registrationData.password - Plain text password (will be hashed)
   *
   * @returns Promise resolving to the newly created user entity
   *
   * @throws {EmailAlreadyExistsDomainException} When email is already registered
   * @throws {UsernameAlreadyExistsDomainException} When username is already taken
   * @throws {ValidationException} When registration data is invalid
   * @throws {InternalServerErrorException} For unexpected errors during registration
   */
  async execute(params: SignUpArgsDto): Promise<UserDto> {
    this.logger.assign({ method: 'execute' });
    this.logger.debug('Starting user registration process');

    try {
      const data = params.input;
      // Delegate user registration to the CreateUserUseCase
      // The use case handles validation, constraint checking, password hashing, and persistence
      const userDto = await this.createUserUseCase.execute({ data });

      this.logger.assign({ userId: userDto.id, userEmail: userDto.email });
      this.logger.debug('User registration completed successfully');

      // TODO: Add any post-registration business logic here
      // - Send welcome email
      // - Create user preferences
      // - Log registration event
      // - Trigger user creation domain events

      console.log('Registered user:', userDto);

      return userDto;
    } catch (error) {
      this.logger.assign({ error: error instanceof Error ? error.message : 'Unknown error' });
      this.logger.error('User registration failed');
      throw error;
    }
  }
}
