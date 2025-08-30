import { DomainError, InternalServerError, NotFoundError } from '@/shared/domain/errors';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { UserFindByIdArgsDto } from '../dto/args';

/**
 * Use case for finding a user by their unique identifier
 * Implements business logic for user lookup operations by ID
 * Handles validation through DTOs and error scenarios for ID-based user searches
 */
@Injectable()
export class FindUserByIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(FindUserByIdUseCase.name);
  }

  /**
   * Executes the find user by ID use case
   * Receives validated and normalized data through DTO
   * @param args - Validated arguments containing the user ID
   * @returns Promise resolving to the found user entity
   * @throws NotFoundError when user with given ID does not exist
   * @throws InternalServerError for unexpected errors during execution
   */
  async execute(args: UserFindByIdArgsDto): Promise<UserEntity> {
    const logger = this.logger;
    logger.assign({ method: 'execute' });
    logger.assign({ query: { id: args.id } });

    try {
      logger.debug('Finding user by ID');

      // Find user by ID using repository
      // ID is already validated and normalized through DTO validation
      const user = await this.userRepository.findById(args.id);

      // Handle case when user is not found
      if (!user) {
        logger.warn('User not found by ID');
        throw new NotFoundError(`User not found`, {
          extensions: { code: 'USER_NOT_FOUND' },
        });
      }

      logger.debug({ user }, 'User found by ID successfully');
      // Transform and return the user entity
      return plainToInstance(UserEntity, user);
    } catch (error) {
      // Validate if error is instance of DomainError
      if (error instanceof DomainError) {
        // Only throw the error, it will be handled by exception filters
        throw error;
      }

      // If it is any other error, we create an error log and set an InternalServerError so as not to propagate the original error to the user
      logger.error({ error: error as Error }, 'Error finding user by ID');
      throw new InternalServerError('Error finding user by ID');
    }
  }
}
