import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

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
  providers: [
    // Repository implementations will be registered here
    // Use cases will be registered here
    // Resolvers will be registered here
    // Domain services will be registered here
  ],
  exports: [
    // Export services that other modules might need
  ],
})
export class AuthModule {}
