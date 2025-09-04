import { Module } from '@nestjs/common';

import { SharedModule } from '@/shared/shared.module';

/**
 * Authentication module responsible for handling user authentication,
 * authorization, token management, and security-related operations.
 *
 * This module follows hexagonal architecture principles with clear separation
 * between application, domain, and infrastructure layers.
 *
 * @module AuthModule
 * @description Provides authentication and authorization capabilities for the application
 */
@Module({
  imports: [SharedModule],
  providers: [],
  exports: [
    // Export services that other modules might need
  ],
})
export class AuthModule {}
