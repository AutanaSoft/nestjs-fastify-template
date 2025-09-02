import { DomainError, InternalServerError, NotFoundError } from '@/shared/domain/errors';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { UserFindByEmailArgsDto } from '../dto/args';

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
  async execute(params: UserFindByEmailArgsDto): Promise<UserEntity> {
    this.logger.assign({ method: 'execute' });
    this.logger.debug('Executing find user by email use case');

    try {
      const { input } = params;
      // Normalize email to lowercase for consistent searching
      const normalizedEmail = input.email.trim().toLowerCase();

      // Find user by email using repository
      const user = await this.userRepository.findByEmail(normalizedEmail);

      // Handle case when user is not found
      if (!user) {
        this.logger.warn('User not found by email');
        throw new NotFoundError(`User with email ${normalizedEmail} not found`);
      }

      this.logger.debug({ user }, 'User found by email successfully');
      return user;
    } catch (error) {
      // validate if error instance of DomainError
      if (error instanceof DomainError) {
        // only throw the error, it will be handled by exception filters
        throw error;
      }

      //If it is any other error, we create an error log and set an InternalServerError so as not to propagate the original error to the user.
      this.logger.error({ error: error as Error }, 'Error finding user by email');
      throw new InternalServerError('Error finding user by email');
    }
  }
}
