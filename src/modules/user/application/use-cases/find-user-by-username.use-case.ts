import { DomainError, InternalServerError, NotFoundError } from '@/shared/domain/errors';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { UserFindByUserNameArgsDto } from '../dto/args';

/**
 * Use case for finding a user by their username
 * Implements business logic for user lookup operations by username
 * Handles validation through DTOs and error scenarios for username-based user searches
 */
@Injectable()
export class FindUserByUserNameUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(FindUserByUserNameUseCase.name);
  }

  /**
   * Executes the find user by username use case
   * Receives validated and normalized data through DTO
   * @param params - Validated arguments containing the username
   * @returns Promise resolving to the found user entity
   * @throws NotFoundError when user with given username does not exist
   * @throws InternalServerError for unexpected errors during execution
   */
  async execute(params: UserFindByUserNameArgsDto): Promise<UserEntity> {
    const logger = this.logger;
    logger.assign({ method: 'execute', params });

    try {
      const { input } = params;
      logger.debug('Finding user by username');

      // Find user by username using repository
      // Username is already validated and normalized (trimmed) through DTO validation
      const user = await this.userRepository.findByUserName(input.userName);

      // Handle case when user is not found
      if (!user) {
        logger.warn('User not found by username');
        throw new NotFoundError(`User with username ${input.userName} not found`);
      }

      logger.debug({ user }, 'User found by username successfully');
      // Transform and return the user entity
      return plainToInstance(UserEntity, user);
    } catch (error) {
      // Validate if error is instance of DomainError
      if (error instanceof DomainError) {
        // Only throw the error, it will be handled by exception filters
        throw error;
      }

      // If it is any other error, we create an error log and set an InternalServerError so as not to propagate the original error to the user
      logger.error({ error: error as Error }, 'Error finding user by username');
      throw new InternalServerError('Error finding user by username');
    }
  }
}
