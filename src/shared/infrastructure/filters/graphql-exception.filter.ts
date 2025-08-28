import { GraphQLContext } from '@/shared/domain/interfaces/graphql.interface';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { ApplicationError, DomainError, InfrastructureError } from '@shared/domain/errors';
import { GraphQLError } from 'graphql';
import { InjectPinoLogger, Logger } from 'nestjs-pino';
import { X_CORRELATION_ID } from '../middleware';

/**
 * Normalized error response structure
 */
interface ErrorResponse {
  status: HttpStatus;
  message: string;
  code: string;
  extensions?: Record<string, unknown>;
}

/**
 * Global GraphQL exception filter following NestJS best practices
 * Handles all unhandled exceptions and transforms them into appropriate GraphQL errors
 */
@Catch()
export class GraphQLExceptionFilter implements ExceptionFilter {
  constructor(
    @InjectPinoLogger(GraphQLExceptionFilter.name)
    private readonly logger: Logger,
  ) {}

  /**
   * Catches and processes all exceptions according to NestJS exception filter pattern
   * @param exception - The caught exception to process
   * @param host - The arguments host containing execution context
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    // Try to extract correlation ID from different contexts
    const correlationId = this.extractCorrelationId(host);

    // Handle our custom GraphQL errors (Domain, Application, Infrastructure)
    if (
      exception instanceof DomainError ||
      exception instanceof ApplicationError ||
      exception instanceof InfrastructureError
    ) {
      // Selective logging: Only log non-domain errors
      if (!(exception instanceof DomainError)) {
        this.logger.error({
          message: exception.message,
          extensions: exception.extensions,
          stack: exception instanceof Error ? exception.stack : undefined,
          correlationId,
        });
      }

      // Add correlation ID to existing extensions and throw
      this.enrichErrorWithCorrelationId(exception as GraphQLError, correlationId);
      throw exception;
    }

    // Handle existing GraphQL errors (pass through with correlation ID)
    if (exception instanceof GraphQLError) {
      this.logger.warn({
        message: exception.message,
        extensions: exception.extensions,
        stack: exception.stack,
        correlationId,
      });

      // Add correlation ID and throw
      this.enrichErrorWithCorrelationId(exception, correlationId);
      throw exception;
    }

    // For other types of errors, normalize them
    const errorResponse = this.normalizeError(exception);

    // Log error details for non-GraphQL errors
    this.logger.error({
      ...errorResponse,
      stack: exception instanceof Error ? exception.stack : undefined,
      correlationId,
    });

    // Create GraphQL formatted error
    const graphqlError = new GraphQLError(errorResponse.message, {
      extensions: {
        code: errorResponse.code,
        statusCode: errorResponse.status,
        ...errorResponse.extensions,
        correlationId,
      },
    });

    throw graphqlError;
  }

  /**
   * Normalizes non-GraphQL errors into a consistent format
   * @param exception The caught exception
   * @returns Normalized error response
   */
  private normalizeError(exception: unknown): ErrorResponse {
    // Handle NestJS HTTP exceptions
    if (exception instanceof HttpException) {
      const response = exception.getResponse() as string | Record<string, unknown>;

      let message: string;
      if (typeof response === 'string') {
        message = response;
      } else if (typeof response.message === 'string') {
        message = response.message;
      } else if (Array.isArray(response.message)) {
        message = (response.message as string[]).join(', ');
      } else {
        message = exception.message;
      }

      return {
        status: exception.getStatus(),
        message: String(message),
        code: exception.constructor.name.replace('Exception', '').toUpperCase(),
        extensions: typeof response === 'object' ? response : {},
      };
    }

    // Handle unknown errors
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception instanceof Error ? exception.message : 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      extensions: {
        timestamp: new Date().toISOString(),
        error: exception instanceof Error ? exception.constructor.name : 'Unknown Error',
      },
    };
  }

  /**
   * Extracts correlation ID from Mercurius/Fastify context
   * @param host The arguments host containing execution context
   * @returns Correlation ID from headers or fallback
   */
  private extractCorrelationId(host: ArgumentsHost): string {
    const ctx = GqlArgumentsHost.create(host);
    const gqlContext = ctx.getContext<GraphQLContext>();
    const response = gqlContext.res;
    const correlationId = response?.getHeader(X_CORRELATION_ID) as string | undefined;
    return correlationId || 'no-correlation-id';
  }

  /**
   * Enriches a GraphQL error with correlation ID
   * @param error GraphQL error to enrich
   * @param correlationId Correlation ID to add
   */
  private enrichErrorWithCorrelationId(error: GraphQLError, correlationId: string): void {
    if (error.extensions && typeof error.extensions === 'object') {
      if (!('correlationId' in error.extensions)) {
        (error.extensions as Record<string, unknown>).correlationId = correlationId;
      }
    }
  }
}
