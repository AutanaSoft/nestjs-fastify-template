// src/correlation/correlation.service.ts
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class CorrelationService {
  private readonly store = new AsyncLocalStorage<string>();

  /**
   * Runs a function within an asynchronous context with a correlation ID.
   * @param correlationId The correlation ID for the current request.
   * @param callback The function to execute.
   */
  run(correlationId: string, callback: () => void): void {
    this.store.run(correlationId, callback);
  }

  /**
   * Gets the correlation ID for the current request.
   * @returns The correlation ID or undefined if not in context.
   */
  get(): string | undefined {
    return this.store.getStore();
  }
}
