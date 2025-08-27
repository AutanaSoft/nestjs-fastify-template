import { GraphQLError } from 'graphql';

/**
 * Base abstract class for all domain errors in the application
 * Extends GraphQL error to maintain consistency in GraphQL ecosystem
 * Provides common structure and properties for domain-specific exceptions
 */
export abstract class DomainError extends GraphQLError {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    public readonly cause?: Error,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message, {
      extensions: {
        code,
        statusCode,
        context,
        cause: cause?.message,
      },
    });
    this.name = this.constructor.name;
  }
}

/**
 * Error thrown when a resource already exists
 */
export class ConflictError extends DomainError {
  readonly code = 'CONFLICT';
  readonly statusCode = 409;

  constructor(message: string, cause?: Error, context?: Record<string, unknown>) {
    super(message, 'CONFLICT', 409, cause, context);
  }
}

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;

  constructor(message: string, cause?: Error, context?: Record<string, unknown>) {
    super(message, 'NOT_FOUND', 404, cause, context);
  }
}

/**
 * Error thrown when input data is invalid
 */
export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;

  constructor(
    message: string,
    public readonly errors: string[],
    cause?: Error,
    context?: Record<string, unknown>,
  ) {
    super(message, 'VALIDATION_ERROR', 400, cause, { ...context, errors });
  }
}

/**
 * Error thrown when business rules are violated
 */
export class BusinessRuleError extends DomainError {
  readonly code = 'BUSINESS_RULE_VIOLATION';
  readonly statusCode = 422;

  constructor(message: string, cause?: Error, context?: Record<string, unknown>) {
    super(message, 'BUSINESS_RULE_VIOLATION', 422, cause, context);
  }
}

/**
 * Error thrown when access is forbidden
 */
export class ForbiddenError extends DomainError {
  readonly code = 'FORBIDDEN';
  readonly statusCode = 403;

  constructor(message: string, cause?: Error, context?: Record<string, unknown>) {
    super(message, 'FORBIDDEN', 403, cause, context);
  }
}

/**
 * Error thrown when authentication fails
 */
export class UnauthorizedError extends DomainError {
  readonly code = 'UNAUTHORIZED';
  readonly statusCode = 401;

  constructor(message: string, cause?: Error, context?: Record<string, unknown>) {
    super(message, 'UNAUTHORIZED', 401, cause, context);
  }
}
