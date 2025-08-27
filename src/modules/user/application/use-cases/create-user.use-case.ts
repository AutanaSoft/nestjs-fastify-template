import { UserDto } from '@modules/user/application/dto';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { HashUtils } from '@shared/infrastructure/utils';
import { UseCaseError, ConflictError } from '@shared/domain/errors';
import { plainToInstance } from 'class-transformer';
import { InjectPinoLogger, Logger } from 'nestjs-pino';
import { UserCreateArgsDto } from '../dto/args';

/**
 * Use case for creating new users with validation and security measures
 * Orchestrates user creation including uniqueness validation and password hashing
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectPinoLogger(CreateUserUseCase.name)
    private readonly logger: Logger,
  ) {}

  /**
   * Executes the user creation process with comprehensive validation
   * Validates email and username uniqueness, hashes password, and creates the user
   * @param params - User creation parameters containing user data
   * @returns Promise resolving to the created user DTO
   * @throws ConflictError when user already exists
   * @throws ApplicationError when creation fails
   */
  async execute(params: UserCreateArgsDto): Promise<UserDto> {
    try {
      const { data } = params;

      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictError('User with this email already exists', undefined, {
          email: data.email,
        });
      }

      // Check if username already exists
      const existingUserName = await this.userRepository.findByUserName(data.userName);
      if (existingUserName) {
        throw new ConflictError('User with this username already exists', undefined, {
          userName: data.userName,
        });
      }

      // Hash the password
      const hashedPassword = await HashUtils.hashPassword(data.password);

      // Create user entity with hashed password
      const userData = {
        ...data,
        password: hashedPassword,
      };

      const createdUser = await this.userRepository.create(userData);

      // Transform entity to response DTO
      return plainToInstance(UserDto, createdUser);
    } catch (error) {
      // Re-throw domain errors
      if (error instanceof ConflictError) {
        throw error;
      }

      // Log and wrap other errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        {
          error: errorMessage,
          data: { email: params.data.email, userName: params.data.userName },
        },
        'Failed to create user',
      );

      throw new UseCaseError(`Failed to create user: ${errorMessage}`, error as Error);
    }
  }
}
