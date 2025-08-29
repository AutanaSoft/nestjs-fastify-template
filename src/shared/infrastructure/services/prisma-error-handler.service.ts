import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConflictError, DatabaseError, NotFoundError } from '@shared/domain/errors';
import { PinoLogger } from 'nestjs-pino';

/**
 * Configuration interface for customizing Prisma error handling per module context.
 * Allows modules to provide specific error messages and codes for better user experience.
 */
export interface PrismaErrorConfig {
  /** Context identifier for logging purposes (e.g., 'UserPrismaAdapter') */
  readonly context: string;

  /** Optional custom error messages for different Prisma error types */
  readonly messages?: {
    /** Message for P2002 - Unique constraint violation */
    readonly uniqueConstraint?: string;
    /** Message for P2025 - Record not found */
    readonly notFound?: string;
    /** Message for P2003 - Foreign key constraint violation */
    readonly foreignKeyConstraint?: string;
    /** Message for validation errors */
    readonly validation?: string;
    /** Message for connection/initialization errors */
    readonly connection?: string;
    /** Message for unknown/unhandled errors */
    readonly unknown?: string;
  };

  /** Optional custom error codes for GraphQL extensions */
  readonly codes?: {
    /** Custom code for not found errors */
    readonly notFound?: string;
  };
}

/**
 * Default error messages used when no custom messages are provided.
 * These messages are generic and can be overridden per module context.
 */
const DEFAULT_MESSAGES = {
  uniqueConstraint: 'Resource with these values already exists',
  notFound: 'Resource not found',
  foreignKeyConstraint: 'Invalid reference in data',
  validation: 'Invalid data provided',
  connection: 'Database unavailable',
  unknown: 'An unexpected error occurred',
} as const;

/**
 * Service for centralized Prisma error handling across all modules.
 * Provides consistent mapping of Prisma errors to domain errors with configurable messages.
 *
 * This service implements a strategy pattern where each Prisma error type is handled
 * by a specific private method, ensuring maintainable and testable error handling.
 *
 */
@Injectable()
export class PrismaErrorHandlerService {
  /**
   * Processes Prisma errors and converts them to appropriate domain errors.
   * This method never returns normally - it always throws a domain-specific error.
   *
   * @param error - The error thrown by Prisma operations
   * @param config - Configuration object with context and custom messages
   * @param logger - Pino logger instance for structured logging
   * @throws {ConflictError} For unique constraint violations (P2002) and foreign key constraints (P2003)
   * @throws {NotFoundError} For record not found errors (P2025)
   * @throws {DatabaseError} For validation, connection, and unknown errors
   * @returns Never returns - always throws an error
   */
  public handleError(error: unknown, config: PrismaErrorConfig, logger: PinoLogger): never {
    const messages: Record<string, string> = { ...DEFAULT_MESSAGES, ...config.messages };

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
   * Handles known Prisma client request errors with specific error codes
   *
   * @param error - PrismaClientKnownRequestError instance
   * @param config - Error configuration with context and messages
   * @param messages - Merged default and custom messages
   * @param logger - Pino logger instance
   * @throws {ConflictError} For P2002 and P2003 errors
   * @throws {NotFoundError} For P2025 errors
   * @throws {DatabaseError} For unhandled Prisma error codes
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
   * Handles Prisma validation errors (invalid query structure, missing fields, etc.)
   *
   * @param error - PrismaClientValidationError instance
   * @param config - Error configuration with context
   * @param messages - Merged default and custom messages
   * @param logger - Pino logger instance
   * @throws {DatabaseError} Always throws DatabaseError for validation issues
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
   * Handles Prisma connection and initialization errors
   *
   * @param error - PrismaClientInitializationError instance
   * @param config - Error configuration with context
   * @param messages - Merged default and custom messages
   * @param logger - Pino logger instance
   * @throws {DatabaseError} Always throws DatabaseError for connection issues
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
   * Handles unknown or unexpected errors not caught by specific Prisma error types
   *
   * @param error - Unknown error instance
   * @param config - Error configuration with context
   * @param messages - Merged default and custom messages
   * @param logger - Pino logger instance
   * @throws {DatabaseError} Always throws DatabaseError for unknown errors
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
