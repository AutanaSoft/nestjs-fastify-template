import { GraphQLError } from 'graphql';
import { ErrorOptions } from '../interfaces';

/**
 * Base abstract class for all application layer errors
 * Used for orchestration and use case related errors
 * Extends GraphQL error to maintain consistency in GraphQL ecosystem
 */
export abstract class ApplicationError extends GraphQLError {
  constructor(message: string, options: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

/**
 * Error thrown when use case execution fails
 */
export class UseCaseError extends ApplicationError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'USE_CASE_ERROR',
        statusCode: 500,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when data transformation fails
 */
export class TransformationError extends ApplicationError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'TRANSFORMATION_ERROR',
        statusCode: 500,
        ...options?.extensions,
      },
    });
  }
}
