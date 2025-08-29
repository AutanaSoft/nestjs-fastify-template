import { Controller, Get } from '@nestjs/common';

/**
 * Main application controller
 * Handles basic application endpoints for health checks and root access
 */
@Controller()
export class AppController {
  /**
   * Get hello world message
   * Simple endpoint to verify the application is running
   * @returns A simple hello world greeting message
   */
  @Get()
  getHello(): string {
    return 'Hello World';
  }
}
