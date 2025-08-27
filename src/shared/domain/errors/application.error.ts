/**
 * Base class for application layer errors
 * Used for orchestration and use case related errors
 */
export abstract class ApplicationError extends Error {
  abstract readonly code: string;
  readonly statusCode = 500;

  constructor(
    message: string,
    public readonly cause?: Error,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when use case execution fails
 */
export class UseCaseError extends ApplicationError {
  readonly code = 'USE_CASE_ERROR';
}

/**
 * Error thrown when data transformation fails
 */
export class TransformationError extends ApplicationError {
  readonly code = 'TRANSFORMATION_ERROR';
}
