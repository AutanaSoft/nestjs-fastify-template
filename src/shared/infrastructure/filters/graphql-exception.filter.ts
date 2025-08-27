import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { InjectPinoLogger, Logger } from 'nestjs-pino';
import { ApplicationError, DomainError, InfrastructureError } from '@shared/domain/errors';

/**
 * GraphQL operation info interface for safe type checking
 */
interface GraphQLOperationInfo {
  readonly operation?: {
    readonly operation?: string;
  };
  readonly fieldName?: string;
}

/**
 * GraphQL context interface for safe type checking
 */
interface GraphQLContext {
  readonly user?: {
    readonly id?: string | number;
  };
  readonly correlationId?: string;
  readonly req?: {
    readonly headers?: {
      readonly 'user-agent'?: string;
    };
  };
}

/**
 * Validation error response structure
 */
interface ValidationErrorResponse {
  statusCode: number;
  message: string | string[];
}

/**
 * Global GraphQL exception filter following NestJS best practices
 * Extends BaseExceptionFilter to inherit default behavior while adding custom logic
 * Catches all unhandled exceptions and transforms them into appropriate GraphQL errors
 */
@Catch()
export class GraphQLExceptionFilter extends BaseExceptionFilter {
  constructor(
    @InjectPinoLogger(GraphQLExceptionFilter.name)
    private readonly logger: Logger,
  ) {
    super();
  }

  /**
   * Catches and processes all exceptions according to NestJS exception filter pattern
   * Handles GraphQL-specific context and provides appropriate error transformation
   * @param exception - The caught exception to process
   * @param host - The arguments host containing execution context
   */
  catch(exception: unknown, host: ArgumentsHost) {
    // Extract GraphQL context if available
    const gqlHost = this._getGraphQLContext(host);

    // Log error with contextual information
    this._logError(exception, gqlHost);

    // All our custom errors (Domain, Application, Infrastructure) now extend GraphQLError
    // so we can handle them uniformly
    if (
      exception instanceof DomainError ||
      exception instanceof ApplicationError ||
      exception instanceof InfrastructureError
    ) {
      throw exception;
    }

    // Handle existing GraphQL errors (pass through with logging)
    if (exception instanceof GraphQLError) {
      throw exception;
    }

    // Handle NestJS validation errors
    if (this._isValidationError(exception)) {
      const validationError = exception as { response: ValidationErrorResponse; message?: string };
      throw new GraphQLError('Validation failed', {
        extensions: {
          code: 'BAD_USER_INPUT',
          statusCode: 400,
          validationErrors: validationError.response?.message || validationError.message,
        },
      });
    }

    // For all other exceptions, log and create generic GraphQL error
    this.logger.error(
      {
        error: exception instanceof Error ? exception.message : String(exception),
        stack: exception instanceof Error ? exception.stack : undefined,
        type: exception?.constructor?.name || 'Unknown',
      },
      'Unhandled exception in GraphQL operation',
    );

    throw new GraphQLError('Internal server error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
      },
    });
  }

  /**
   * Safely extracts GraphQL context from ArgumentsHost
   * @param host - The arguments host
   * @returns GraphQL arguments host or null if not GraphQL context
   */
  private _getGraphQLContext(host: ArgumentsHost): GqlArgumentsHost | null {
    try {
      return GqlArgumentsHost.create(host);
    } catch {
      // Not a GraphQL context, return null
      return null;
    }
  }

  /**
   * Logs error information with appropriate context and severity level
   * Includes GraphQL operation details when available
   * @param exception - The exception to log
   * @param gqlHost - GraphQL context (if available)
   */
  private _logError(exception: unknown, gqlHost: GqlArgumentsHost | null): void {
    // Extract GraphQL operation context if available
    const operationContext = this._extractOperationContext(gqlHost);

    if (
      exception instanceof DomainError ||
      exception instanceof ApplicationError ||
      exception instanceof InfrastructureError
    ) {
      // All our custom errors now extend GraphQLError and have extensions
      const logLevel = exception instanceof DomainError ? 'warn' : 'error';

      this.logger[logLevel](
        {
          ...operationContext,
          error: exception.message,
          extensions: exception.extensions,
          stack: exception.stack,
        },
        `${exception.constructor.name}: ${exception.message}`,
      );
    } else if (exception instanceof GraphQLError) {
      this.logger.warn(
        {
          ...operationContext,
          error: exception.message,
          extensions: exception.extensions,
          stack: exception.stack,
        },
        `GraphQL error: ${exception.message}`,
      );
    } else {
      this.logger.error(
        {
          ...operationContext,
          error: exception instanceof Error ? exception.message : String(exception),
          stack: exception instanceof Error ? exception.stack : undefined,
          type: exception?.constructor?.name || 'Unknown',
        },
        'Unknown error occurred',
      );
    }
  }

  /**
   * Extracts operation context from GraphQL execution
   * @param gqlHost - GraphQL arguments host
   * @returns Operation context object
   */
  private _extractOperationContext(gqlHost: GqlArgumentsHost | null): Record<string, unknown> {
    if (!gqlHost) {
      return {};
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const info = gqlHost.getInfo();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const context = gqlHost.getContext();

      // Type-safe extraction with proper type guards
      const safeInfo = this._isGraphQLOperationInfo(info) ? info : null;
      const safeContext = this._isGraphQLContext(context) ? context : null;

      return {
        operation: safeInfo?.operation?.operation,
        fieldName: safeInfo?.fieldName,
        userId: safeContext?.user?.id,
        correlationId: safeContext?.correlationId,
        userAgent: safeContext?.req?.headers?.['user-agent'],
      };
    } catch {
      return {};
    }
  }

  /**
   * Type guard for GraphQL operation info
   * @param value - Value to check
   * @returns True if value matches GraphQL operation info structure
   */
  private _isGraphQLOperationInfo(value: unknown): value is GraphQLOperationInfo {
    return (
      value !== null &&
      typeof value === 'object' &&
      (typeof (value as Record<string, unknown>).fieldName === 'string' ||
        typeof (value as Record<string, unknown>).fieldName === 'undefined') &&
      (typeof (value as Record<string, unknown>).operation === 'object' ||
        typeof (value as Record<string, unknown>).operation === 'undefined')
    );
  }

  /**
   * Type guard for GraphQL context
   * @param value - Value to check
   * @returns True if value matches GraphQL context structure
   */
  private _isGraphQLContext(value: unknown): value is GraphQLContext {
    return value !== null && typeof value === 'object';
  }

  /**
   * Type guard to check if exception is a NestJS validation error
   * @param exception - The exception to check
   * @returns True if it's a validation error
   */
  private _isValidationError(exception: unknown): boolean {
    if (exception === null || typeof exception !== 'object') {
      return false;
    }

    const exceptionObj = exception as Record<string, unknown>;

    return (
      'response' in exceptionObj &&
      typeof exceptionObj.response === 'object' &&
      exceptionObj.response !== null &&
      'statusCode' in (exceptionObj.response as Record<string, unknown>) &&
      (exceptionObj.response as Record<string, unknown>).statusCode === 400
    );
  }
}
