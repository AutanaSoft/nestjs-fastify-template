import { GraphQLError } from 'graphql';
import { ErrorOptions } from '../interfaces';

/**
 * Base abstract class for all infrastructure layer errors
 * Used for external system and adapter related errors
 * Extends GraphQL error to maintain consistency in GraphQL ecosystem
 */
export abstract class InfrastructureError extends GraphQLError {
  constructor(message: string, options: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

/**
 * Error thrown when database operations fail
 */
export class DatabaseError extends InfrastructureError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'DATABASE_ERROR',
        statusCode: 500,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when external services fail
 */
export class ExternalServiceError extends InfrastructureError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'EXTERNAL_SERVICE_ERROR',
        statusCode: 502,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when network operations fail
 */
export class NetworkError extends InfrastructureError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'NETWORK_ERROR',
        statusCode: 503,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when cache operations fail
 */
export class CacheError extends InfrastructureError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'CACHE_ERROR',
        statusCode: 503,
        ...options?.extensions,
      },
    });
  }
}
