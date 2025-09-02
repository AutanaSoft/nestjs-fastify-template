import { Controller, Get } from '@nestjs/common';
import { CorrelationId } from '@shared/application/decorators';

/**
 * Main application controller
 * Handles basic application endpoints for health checks and root access
 */
@Controller()
export class AppController {
  /**
   * Get hello world message
   * Simple endpoint to verify the application is running
   * @param correlationId - Unique identifier for request tracing
   * @returns A simple hello world greeting message
   */
  @Get()
  getHello(@CorrelationId() correlationId: string): string {
    console.log(`Processing request with correlation ID: ${correlationId}`);
    return 'Hello World';
  }
}
