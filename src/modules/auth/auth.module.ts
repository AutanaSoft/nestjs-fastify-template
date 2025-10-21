import { Module } from '@nestjs/common';

import { UserModule } from '@/modules/user/user.module';
import { SharedModule } from '@/shared/shared.module';
import { FindUserUseCase, RegisterUserUseCase } from './application/use-cases';
import { AuthRepository, RefreshTokenRepository } from './domain/repositories';
import { AuthUserAdapter, RefreshTokenPrismaAdapter } from './infrastructure/adapters';
import { GqlJwtAuthGuard, JwtAuthGuard } from './infrastructure/guards';
import { AuthResolver } from './infrastructure/resolvers/auth.resolver';
import { JwtStrategy } from './infrastructure/strategies';

/**
 * Authentication module responsible for handling user authentication,
 * authorization, token management, and security-related operations.
 *
 * This module follows hexagonal architecture principles with clear separation
 * between application, domain, and infrastructure layers. It coordinates with
 * the UserModule through use case composition, maintaining proper architectural
 * boundaries between auth and user domains.
 *
 * Features:
 * - JWT token authentication with Passport integration
 * - AuthGuards for protecting routes (HTTP and GraphQL)
 * - User authentication and authorization
 * - Refresh token management
 * - Clean architecture with proper layer separation
 *
 * @module AuthModule
 * @description Provides authentication and authorization capabilities for the application
 */
@Module({
  imports: [SharedModule, UserModule],
  providers: [
    // Authentication repositories
    {
      provide: AuthRepository,
      useClass: AuthUserAdapter,
    },
    {
      provide: RefreshTokenRepository,
      useClass: RefreshTokenPrismaAdapter,
    },
    // Use cases
    RegisterUserUseCase,
    FindUserUseCase,
    // Passport strategy
    JwtStrategy,
    // Guards
    JwtAuthGuard,
    GqlJwtAuthGuard,
    // Resolvers
    AuthResolver,
  ],
  exports: [AuthRepository, RefreshTokenRepository, JwtAuthGuard, GqlJwtAuthGuard, JwtStrategy],
})
export class AuthModule {}
