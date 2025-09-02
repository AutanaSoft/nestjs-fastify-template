import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { jwtConfig, createJwtModuleOptions } from '@/config';
import { SharedModule } from '@/shared/shared.module';

import { TokenRepository } from './domain/repositories';
import { JwtTokenAdapter } from './infrastructure/adapters';
import { AuthGuard } from './infrastructure/guards';

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
  imports: [
    SharedModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: createJwtModuleOptions,
      inject: [jwtConfig.KEY],
    }),
  ],
  providers: [
    // Repository implementations
    {
      provide: TokenRepository,
      useClass: JwtTokenAdapter,
    },
    // Guards
    AuthGuard,
    // Use cases will be registered here
    // Resolvers will be registered here
    // Domain services will be registered here
  ],
  exports: [
    TokenRepository,
    AuthGuard,
    // Export services that other modules might need
  ],
})
export class AuthModule {}
