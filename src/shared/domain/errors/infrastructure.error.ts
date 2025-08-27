/**
 * Base class for infrastructure layer errors
 * Used for external system and adapter related errors
 */
export abstract class InfrastructureError extends Error {
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
 * Error thrown when database operations fail
 */
export class DatabaseError extends InfrastructureError {
  readonly code = 'DATABASE_ERROR';
}

/**
 * Error thrown when external services fail
 */
export class ExternalServiceError extends InfrastructureError {
  readonly code = 'EXTERNAL_SERVICE_ERROR';
}

/**
 * Error thrown when network operations fail
 */
export class NetworkError extends InfrastructureError {
  readonly code = 'NETWORK_ERROR';
}

/**
 * Error thrown when cache operations fail
 */
export class CacheError extends InfrastructureError {
  readonly code = 'CACHE_ERROR';
}
