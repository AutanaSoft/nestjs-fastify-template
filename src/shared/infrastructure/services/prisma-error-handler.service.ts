import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DEFAULT_PRISMA_ERROR_MESSAGES } from '@shared/domain/constants';
import { ConflictError, DatabaseError, NotFoundError } from '@shared/domain/errors';
import { PrismaErrorConfig } from '@shared/domain/interfaces';
import { PinoLogger } from 'nestjs-pino';

/**
 * Service for centralized handling of Prisma ORM errors across the application
 *
 * This service translates low-level Prisma database errors into domain-specific exceptions
 * that can be properly handled by the application layers. It follows the principles of:
 * - Domain-driven design by mapping infrastructure errors to domain concepts
 * - Single responsibility by focusing solely on error translation
 * - Open-closed principle by supporting extension through configuration
 *
 * Key features:
 * - Consistent error handling across all repositories
 * - Configurable error messages per repository context
 * - Proper mapping to GraphQL error codes
 * - Structured logging of error details
 * - Clear separation between infrastructure and domain errors
 */
@Injectable()
export class PrismaErrorHandlerService {
  /**
   * Creates a new instance of the PrismaErrorHandlerService
   *
   * @param logger - Pino logger for structured error logging
   */
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(PrismaErrorHandlerService.name);
  }

  /**
   * Processes Prisma errors and converts them to appropriate domain errors.
   * This method never returns normally - it always throws a domain-specific error.
   *
   * The error handling strategy is determined by the type of Prisma error:
   * - PrismaClientKnownRequestError: Handled by specific error code
   * - PrismaClientValidationError: Mapped to validation errors
   * - PrismaClientInitializationError: Mapped to connection errors
   * - Other errors: Treated as unknown database errors
   *
   * @param error - The error thrown by Prisma operations
   * @param config - Configuration object with custom messages and codes
   * @throws {ConflictError} For unique constraint violations (P2002) and foreign key constraints (P2003)
   * @throws {NotFoundError} For record not found errors (P2025)
   * @throws {DatabaseError} For validation, connection, and unknown errors
   * @returns Never returns - always throws an error
   */
  public handleError(error: unknown, config: PrismaErrorConfig): never {
    const messages: Record<string, string> = {
      ...DEFAULT_PRISMA_ERROR_MESSAGES,
      ...config.messages,
    };
    this.logger.assign({ error });
    this.logger.debug('Handling Prisma error');

    // Handle known Prisma client errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handleKnownRequestError(error, config, messages);
    }

    // Handle Prisma validation errors
    if (error instanceof Prisma.PrismaClientValidationError) {
      return this.handleValidationError(error, messages);
    }

    // Handle Prisma connection/initialization errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return this.handleConnectionError(error, messages);
    }

    // Handle unknown errors
    return this.handleUnknownError(error, messages);
  }

  /**
   * Handles known Prisma client request errors with specific error codes
   *
   * Maps Prisma error codes to appropriate domain exceptions:
   * - P2002: Unique constraint violations → ConflictError
   * - P2025: Record not found → NotFoundError
   * - P2003: Foreign key constraint → ConflictError
   *
   * @param error - PrismaClientKnownRequestError instance
   * @param config - Error configuration with custom messages and codes
   * @param messages - Merged default and custom messages
   * @throws {ConflictError} For P2002 and P2003 errors
   * @throws {NotFoundError} For P2025 errors
   * @throws {DatabaseError} For unhandled Prisma error codes
   */
  private handleKnownRequestError(
    error: Prisma.PrismaClientKnownRequestError,
    config: PrismaErrorConfig,
    messages: Record<string, string>,
  ): never {
    switch (error.code) {
      case 'P2002': // Unique constraint violation
        this.logger.debug(messages.uniqueConstraint);
        throw new ConflictError(messages.uniqueConstraint);

      case 'P2025': // Record not found
        this.logger.debug(messages.notFound);
        throw new NotFoundError(messages.notFound, {
          extensions: {
            code: config.codes?.notFound || 'RESOURCE_NOT_FOUND',
          },
        });

      case 'P2003': // Foreign key constraint violation
        this.logger.debug(messages.foreignKeyConstraint);
        throw new ConflictError(messages.foreignKeyConstraint);

      default:
        // Handle other known Prisma errors as database errors
        this.logger.error(`Unhandled Prisma error code: ${error.code}`);
        throw new DatabaseError(messages.unknown);
    }
  }

  /**
   * Handles Prisma validation errors (invalid query structure, missing fields, etc.)
   *
   * These errors typically occur when there's a mismatch between the expected
   * schema and the data provided to Prisma operations.
   *
   * @param error - PrismaClientValidationError instance
   * @param messages - Merged default and custom messages
   * @throws {DatabaseError} Always throws DatabaseError for validation issues
   */
  private handleValidationError(
    error: Prisma.PrismaClientValidationError,
    messages: Record<string, string>,
  ): never {
    this.logger.assign({ method: 'handleValidationError' });
    this.logger.debug('Processing Prisma validation error');
    throw new DatabaseError(messages.validation);
  }

  /**
   * Handles Prisma connection and initialization errors
   *
   * These errors typically occur when the database is unavailable,
   * credentials are invalid, or there are network connectivity issues.
   *
   * @param error - PrismaClientInitializationError instance
   * @param messages - Merged default and custom messages
   * @throws {DatabaseError} Always throws DatabaseError for connection issues
   */
  private handleConnectionError(
    error: Prisma.PrismaClientInitializationError,
    messages: Record<string, string>,
  ): never {
    this.logger.assign({ method: 'handleConnectionError', error });
    this.logger.debug('Processing Prisma connection error');
    throw new DatabaseError(messages.connection);
  }

  /**
   * Handles unknown or unexpected errors not caught by specific Prisma error types
   *
   * This is a fallback handler for any errors that don't match the known
   * Prisma error categories. All errors are logged and wrapped in a DatabaseError.
   *
   * @param error - Unknown error instance
   * @param messages - Merged default and custom messages
   * @throws {DatabaseError} Always throws DatabaseError for unknown errors
   */
  private handleUnknownError(error: unknown, messages: Record<string, string>): never {
    this.logger.assign({ method: 'handleUnknownError' });
    this.logger.error('Processing unknown database error');
    throw new DatabaseError(messages.unknown);
  }
}
