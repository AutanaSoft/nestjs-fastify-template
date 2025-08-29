import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConflictError, DatabaseError, NotFoundError } from '@shared/domain/errors';
import { PinoLogger } from 'nestjs-pino';

/**
 * Configuration interface for Prisma error mapping
 * Allows customization of error messages and codes per module context
 */
export interface PrismaErrorConfig {
  /** Context identifier for logging (e.g., 'UserPrismaAdapter', 'PostPrismaAdapter') */
  context: string;

  /** Custom messages for specific Prisma error codes */
  messages?: {
    /** P2002 - Unique constraint violation */
    uniqueConstraint?: string;
    /** P2025 - Record not found */
    notFound?: string;
    /** P2003 - Foreign key constraint violation */
    foreignKeyConstraint?: string;
    /** Generic validation error */
    validation?: string;
    /** Generic connection error */
    connection?: string;
    /** Fallback for unknown errors */
    unknown?: string;
  };

  /** Custom error codes for GraphQL extensions */
  codes?: {
    /** Code for not found errors */
    notFound?: string;
  };
}

/**
 * Default error messages used when no custom messages are provided
 */
const DEFAULT_MESSAGES = {
  uniqueConstraint: 'Resource with these values already exists',
  notFound: 'Resource not found',
  foreignKeyConstraint: 'Invalid reference in data',
  validation: 'Invalid data provided',
  connection: 'Database unavailable',
  unknown: 'An unexpected error occurred',
};

/**
 * Service for handling Prisma errors in a consistent and configurable way
 * Maps Prisma-specific errors to domain errors with proper logging
 *
 * Usage:
 * ```typescript
 * constructor(
 *   private readonly prismaErrorHandler: PrismaErrorHandlerService
 * ) {}
 *
 * async someMethod() {
 *   try {
 *     // ... prisma operations
 *   } catch (error) {
 *     this.prismaErrorHandler.handleError(error, {
 *       context: 'UserPrismaAdapter',
 *       messages: {
 *         uniqueConstraint: 'User with this email or username already exists',
 *         notFound: 'User not found'
 *       },
 *       codes: {
 *         notFound: 'USER_NOT_FOUND'
 *       }
 *     }, this.logger);
 *   }
 * }
 * ```
 */
@Injectable()
export class PrismaErrorHandlerService {
  /**
   * Processes Prisma errors and throws appropriate domain errors
   * @param error - The error object to process (typically from Prisma operations)
   * @param config - Configuration for error mapping and messages
   * @param logger - Logger instance for the calling context
   * @throws ConflictError for unique constraints and foreign key violations
   * @throws NotFoundError for missing records
   * @throws DatabaseError for validation, connection, and unknown errors
   */
  handleError(error: unknown, config: PrismaErrorConfig, logger: PinoLogger): never {
    const messages = { ...DEFAULT_MESSAGES, ...config.messages };

    // Handle known Prisma client errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handleKnownRequestError(error, config, messages, logger);
    }

    // Handle Prisma validation errors
    if (error instanceof Prisma.PrismaClientValidationError) {
      return this.handleValidationError(error, config, messages, logger);
    }

    // Handle Prisma connection/initialization errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return this.handleConnectionError(error, config, messages, logger);
    }

    // Handle unknown errors
    return this.handleUnknownError(error, config, messages, logger);
  }

  /**
   * Handles known Prisma request errors (P2xxx codes)
   */
  private handleKnownRequestError(
    error: Prisma.PrismaClientKnownRequestError,
    config: PrismaErrorConfig,
    messages: Record<string, string>,
    logger: PinoLogger,
  ): never {
    const logContext = { originalError: error, context: config.context };

    switch (error.code) {
      case 'P2002': // Unique constraint violation
        logger.debug(logContext, messages.uniqueConstraint);
        throw new ConflictError(messages.uniqueConstraint);

      case 'P2025': // Record not found
        logger.debug(logContext, messages.notFound);
        throw new NotFoundError(messages.notFound, {
          extensions: {
            code: config.codes?.notFound || 'RESOURCE_NOT_FOUND',
          },
        });

      case 'P2003': // Foreign key constraint violation
        logger.debug(logContext, messages.foreignKeyConstraint);
        throw new ConflictError(messages.foreignKeyConstraint);

      default:
        // Handle other known Prisma errors as database errors
        logger.error(logContext, `Unhandled Prisma error code: ${error.code}`);
        throw new DatabaseError(messages.unknown);
    }
  }

  /**
   * Handles Prisma validation errors
   */
  private handleValidationError(
    error: Prisma.PrismaClientValidationError,
    config: PrismaErrorConfig,
    messages: Record<string, string>,
    logger: PinoLogger,
  ): never {
    const logContext = { error, context: config.context };
    logger.debug(logContext, messages.validation);
    throw new DatabaseError(messages.validation);
  }

  /**
   * Handles Prisma connection/initialization errors
   */
  private handleConnectionError(
    error: Prisma.PrismaClientInitializationError,
    config: PrismaErrorConfig,
    messages: Record<string, string>,
    logger: PinoLogger,
  ): never {
    const logContext = { error, context: config.context };
    logger.error(logContext, messages.connection);
    throw new DatabaseError(messages.connection);
  }

  /**
   * Handles unknown/unexpected errors
   */
  private handleUnknownError(
    error: unknown,
    config: PrismaErrorConfig,
    messages: Record<string, string>,
    logger: PinoLogger,
  ): never {
    const logContext = { error, context: config.context };
    logger.error(logContext, 'An unexpected database error occurred');
    throw new DatabaseError(messages.unknown);
  }
}
