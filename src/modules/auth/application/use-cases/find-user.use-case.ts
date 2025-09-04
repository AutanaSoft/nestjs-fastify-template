import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { isEmail } from 'class-validator';
import { UserEntity } from '@/modules/user/domain/entities';
import {
  FindUserByEmailUseCase,
  FindUserByUsernameUseCase,
} from '@/modules/user/application/use-cases';
import {
  UserFindByEmailArgsDto,
  UserFindByUserNameArgsDto,
} from '@/modules/user/application/dto/args';

/**
 * Use case for finding users by email or username for authentication purposes.
 *
 * This use case orchestrates user lookup operations by coordinating with the
 * appropriate user module use cases. It provides flexible user search capabilities
 * supporting both email and username authentication strategies.
 *
 * The use case serves as the entry point for user lookup from the auth context
 * and encapsulates the business logic for determining the appropriate search strategy.
 */
@Injectable()
export class FindUserUseCase {
  /**
   * Creates a new FindUserUseCase instance.
   *
   * @param findUserByEmailUseCase - Use case for finding users by email
   * @param findUserByUsernameUseCase - Use case for finding users by username
   * @param logger - Pino logger for structured logging
   */
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly findUserByUsernameUseCase: FindUserByUsernameUseCase,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(FindUserUseCase.name);
  }

  /**
   * Executes the user lookup process with automatic email/username detection.
   *
   * This method coordinates the user search workflow by:
   * 1. Determining if the identifier is an email or username using validation
   * 2. Delegating to the appropriate user module use case for lookup
   * 3. Handling errors and providing consistent response format
   *
   * The method uses class-validator's isEmail function for robust email detection
   * and delegates to specialized use cases for actual user retrieval.
   *
   * @param emailOrUserName - The email address or username to search for
   *
   * @returns Promise resolving to:
   *   - UserEntity if a user is found with the given email or username
   *   - null if no user exists with the provided identifier
   *
   * @throws {ValidationException} When the identifier format is invalid
   * @throws {NotFoundError} When no user exists with the given identifier
   * @throws {InternalServerError} For unexpected errors during user lookup
   */
  async execute(emailOrUserName: string): Promise<UserEntity | null> {
    this.logger.assign({ method: 'execute' });
    this.logger.debug('Starting user lookup process');

    try {
      // Determine if the identifier is a valid email using class-validator
      const isEmailFormat = isEmail(emailOrUserName);

      this.logger.assign({ emailOrUserName, isEmailFormat });
      this.logger.debug('Determined identifier type');

      let user: UserEntity | null = null;

      if (isEmailFormat) {
        // Search by email using the email use case
        this.logger.debug('Delegating to FindUserByEmailUseCase');

        const findByEmailArgs: UserFindByEmailArgsDto = {
          input: { email: emailOrUserName },
        };

        try {
          user = await this.findUserByEmailUseCase.execute(findByEmailArgs);
        } catch (error) {
          // If user not found by email, return null instead of throwing
          if (error instanceof Error && error.message.includes('not found')) {
            this.logger.debug('User not found by email');
            return null;
          }
          throw error;
        }
      } else {
        // Search by username using the username use case
        this.logger.debug('Delegating to FindUserByUsernameUseCase');

        const findByUsernameArgs: UserFindByUserNameArgsDto = {
          input: { userName: emailOrUserName },
        };

        try {
          user = await this.findUserByUsernameUseCase.execute(findByUsernameArgs);
        } catch (error) {
          // If user not found by username, return null instead of throwing
          if (error instanceof Error && error.message.includes('not found')) {
            this.logger.debug('User not found by username');
            return null;
          }
          throw error;
        }
      }

      this.logger.assign({ userFound: !!user, userId: user?.id });
      this.logger.debug('User lookup completed');

      return user;
    } catch (error) {
      this.logger.assign({ error: error instanceof Error ? error.message : 'Unknown error' });
      this.logger.error('User lookup failed');
      throw error;
    }
  }
}
