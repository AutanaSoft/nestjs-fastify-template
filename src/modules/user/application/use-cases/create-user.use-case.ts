import { UserDto } from '@modules/user/application/dto';
import { UserCreatedEvent } from '@modules/user/domain/events';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { EventBusService } from '@shared/application/services';
import { ConflictError, DomainError, InternalServerError } from '@shared/domain/errors';
import { HashUtils } from '@shared/infrastructure/utils';
import { plainToInstance } from 'class-transformer';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { UserCreateArgsDto } from '../dto/args';

/**
 * Use case for creating new users with validation and security measures
 * Orchestrates user creation including uniqueness validation and password hashing
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBusService,
    @InjectPinoLogger(CreateUserUseCase.name)
    private readonly logger: PinoLogger,
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
    this.logger.assign({ method: 'execute' });
    this.logger.debug('User creation process started');

    try {
      const { data } = params;

      // Check if user already exists
      this.logger.debug(`Checking if user with email ${data.email} already exists`);
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        this.logger.debug('Conflict detected: User with this email already exists');
        throw new ConflictError('User with this email already exists');
      }

      // Check if username already exists
      this.logger.debug(`Checking if user with username ${data.userName} already exists`);
      const existingUserName = await this.userRepository.findByUserName(data.userName);
      if (existingUserName) {
        this.logger.debug('Conflict detected: User with this username already exists');
        throw new ConflictError('User with this username already exists');
      }

      // Hash the password
      this.logger.debug('Hashing user password');
      const hashedPassword = await HashUtils.hashPassword(data.password);

      // Create user entity with hashed password
      this.logger.debug('Creating user entity');
      const userData = {
        ...data,
        password: hashedPassword,
      };

      this.logger.debug('Creating user in repository');
      const createdUser = await this.userRepository.create(userData);
      this.logger.debug('User created in repository');

      // Emit user created domain event
      this.logger.debug('Publishing UserCreatedEvent');
      const userCreatedEvent = new UserCreatedEvent(createdUser);
      this.eventBus.publish(userCreatedEvent);

      // Transform entity to response DTO
      this.logger.debug('Transforming created user entity to DTO');
      return plainToInstance(UserDto, createdUser);
    } catch (error) {
      // validate if error instance of DomainError
      if (error instanceof DomainError) {
        // only throw the error, it will be handled by exception filters
        throw error;
      }

      // Log and wrap other errors
      const message = 'Failed to create user';
      this.logger.error({ error: error as Error }, message);
      throw new InternalServerError(message);
    }
  }
}
