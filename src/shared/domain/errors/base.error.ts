import { GraphQLError } from 'graphql';
import { ErrorOptions } from '../interfaces';

/**
 * Base abstract class for all domain errors in the application
 * Extends GraphQL error to maintain consistency in GraphQL ecosystem
 * Provides common structure and properties for domain-specific exceptions
 */
export abstract class DomainError extends GraphQLError {
  constructor(message: string, options: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'NOT_FOUND',
        statusCode: 404,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when a resource already exists
 */
export class ConflictError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'CONFLICT',
        statusCode: 409,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when request data is invalid or malformed
 */
export class BadRequestError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'BAD_REQUEST',
        statusCode: 400,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when authentication fails
 */
export class UnauthorizedError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'UNAUTHORIZED',
        statusCode: 401,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when access is forbidden
 */
export class ForbiddenError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'FORBIDDEN',
        statusCode: 403,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when the request is not acceptable
 */
export class NotAcceptableError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'NOT_ACCEPTABLE',
        statusCode: 406,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when the request times out
 */
export class RequestTimeoutError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'REQUEST_TIMEOUT',
        statusCode: 408,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when HTTP version is not supported
 */
export class HttpVersionNotSupportedError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'HTTP_VERSION_NOT_SUPPORTED',
        statusCode: 505,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when the request payload is too large
 */
export class PayloadTooLargeError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'PAYLOAD_TOO_LARGE',
        statusCode: 413,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when the entity cannot be processed
 */
export class UnprocessableEntityError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'UNPROCESSABLE_ENTITY',
        statusCode: 422,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when an internal server error occurs
 */
export class InternalServerError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when a feature is not implemented
 */
export class NotImplementedError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'NOT_IMPLEMENTED',
        statusCode: 501,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when HTTP method is not allowed
 */
export class MethodNotAllowedError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'METHOD_NOT_ALLOWED',
        statusCode: 405,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when acting as a gateway and received an invalid response
 */
export class BadGatewayError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'BAD_GATEWAY',
        statusCode: 502,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when service is unavailable
 */
export class ServiceUnavailableError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'SERVICE_UNAVAILABLE',
        statusCode: 503,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when acting as a gateway and the request times out
 */
export class GatewayTimeoutError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'GATEWAY_TIMEOUT',
        statusCode: 504,
        ...options?.extensions,
      },
    });
  }
}

/**
 * Error thrown when input data is invalid
 */
export class ValidationError extends DomainError {
  public readonly errors: string[];

  constructor(message: string, errors: string[], options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        errors,
        ...options?.extensions,
      },
    });
    this.errors = errors;
  }
}

/**
 * Error thrown when business rules are violated
 */
export class BusinessRuleError extends DomainError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'BUSINESS_RULE_VIOLATION',
        statusCode: 422,
        ...options?.extensions,
      },
    });
  }
}
