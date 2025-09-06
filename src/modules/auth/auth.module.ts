import { Module } from '@nestjs/common';

import { UserModule } from '@/modules/user/user.module';
import { SharedModule } from '@/shared/shared.module';
import { FindUserUseCase, RegisterUserUseCase } from './application/use-cases';
import { AuthRepository, RefreshTokenRepository } from './domain/repositories';
import { AuthUserAdapter, RefreshTokenPrismaAdapter } from './infrastructure/adapters';
import { AuthResolver } from './infrastructure/resolvers/auth.resolver';

/**
 * Authentication module responsible for handling user authentication,
 * authorization, token management, and security-related operations.
 *
 * This module follows hexagonal architecture principles with clear separation
 * between application, domain, and infrastructure layers. It coordinates with
 * the UserModule through use case composition, maintaining proper architectural
 * boundaries between auth and user domains.
 *
 * @module AuthModule
 * @description Provides authentication and authorization capabilities for the application
 */
@Module({
  imports: [SharedModule, UserModule],
  providers: [
    {
      provide: AuthRepository,
      useClass: AuthUserAdapter,
    },
    RegisterUserUseCase,
    FindUserUseCase,
    AuthResolver,
    {
      provide: RefreshTokenRepository,
      useClass: RefreshTokenPrismaAdapter,
    },
  ],
  exports: [AuthRepository, RefreshTokenRepository],
})
export class AuthModule {}
