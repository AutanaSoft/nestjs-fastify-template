import { NotFoundError } from '@/shared/domain';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

/**
 * Use case for finding a user by their email address
 * Implements business logic for user lookup operations
 * Handles validation and error scenarios for email-based user searches
 */
@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(FindUserByEmailUseCase.name);
  }

  /**
   * Executes the find user by email use case
   * Validates the email parameter and retrieves user from repository
   * @param email - Email address to search for
   * @returns Promise resolving to the found user entity
   * @throws NotFoundException when user with given email does not exist
   */
  async execute(email: string): Promise<UserEntity> {
    const logger = this.logger;
    logger.assign({ method: 'execute' });
    logger.assign({ query: { email: email.trim().toLowerCase() } });

    try {
      // Validate email parameter
      if (!email || email.trim().length === 0) {
        logger.warn('Invalid email provided');
        throw new NotFoundError('Email is required');
      }

      // Normalize email to lowercase for consistent searching
      const normalizedEmail = email.trim().toLowerCase();

      logger.debug('Finding user by email');

      // Find user by email using repository
      const user = await this.userRepository.findByEmail(normalizedEmail);

      // Handle case when user is not found
      if (!user) {
        logger.warn('User not found by email aqui');
        throw new NotFoundError(`User with email ${normalizedEmail} not found`);
      }

      logger.debug({ user }, 'User found by email successfully');
      return user;
    } catch (error) {
      // Log error with context
      logger.error({ error: error as Error }, 'Error finding user by email');
      // Re-throw the error to be handled by exception filters
      throw error;
    }
  }
}
