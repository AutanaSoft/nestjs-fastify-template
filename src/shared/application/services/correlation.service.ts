import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

/**
 * Service for managing correlation IDs across async operations using AsyncLocalStorage.
 *
 * The correlation ID is used for request tracing and logging correlation across
 * the entire request lifecycle, including async operations and nested function calls.
 *
 * @example
 * ```typescript
 * // In a middleware or interceptor
 * correlationService.run('req-123', () => {
 *   // All operations within this callback will have access to the correlation ID
 *   someAsyncOperation();
 * });
 *
 * // Anywhere in the async chain
 * const correlationId = correlationService.getCorrelationId(); // 'req-123'
 * ```
 */
@Injectable()
export class CorrelationService {
  private readonly als = new AsyncLocalStorage<string>();

  /**
   * Establishes a new async context with the provided correlation ID.
   *
   * All async operations executed within the callback will have access
   * to the correlation ID through getCorrelationId().
   *
   * @param correlationId - The correlation ID to associate with this context
   * @param callback - The function to execute within the correlation context
   *
   * @example
   * ```typescript
   * correlationService.run('req-abc-123', async () => {
   *   await userService.createUser(userData);
   *   await emailService.sendWelcomeEmail(email);
   *   // Both operations will have access to 'req-abc-123'
   * });
   * ```
   */
  run(correlationId: string, callback: () => void): void {
    this.als.run(correlationId, callback);
  }

  /**
   * Retrieves the correlation ID from the current async context.
   *
   * @returns The correlation ID if available in the current context, undefined otherwise
   *
   * @example
   * ```typescript
   * const correlationId = correlationService.getCorrelationId();
   * if (correlationId) {
   *   logger.info('Processing request', { correlationId });
   * }
   * ```
   */
  getCorrelationId(): string | undefined {
    return this.als.getStore();
  }
}
