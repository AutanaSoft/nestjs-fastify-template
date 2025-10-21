import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PinoLogger } from 'nestjs-pino';

import { jwtConfig } from '@/config';
import { JwtTokenService } from '@/shared/application/services';
import { JwtPayload } from '@/shared/domain/types';
import { UserEntity } from '@/modules/user/domain/entities';
import { InvalidTokenDomainException, TokenExpiredDomainException } from '../../domain/exceptions';

/**
 * JWT authentication strategy for Passport
 *
 * This strategy validates JWT tokens and extracts user information from the token payload.
 * It integrates with the existing JwtTokenService to maintain consistency across the application.
 *
 * Following NestJS best practices, this strategy:
 * - Validates tokens using the shared JWT service
 * - Extracts tokens from Authorization Bearer header
 * - Returns user entity for use in request pipeline
 * - Handles token validation errors appropriately
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly logger: PinoLogger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secret,
      issuer: config.issuer,
      audience: config.audience,
    });

    this.logger.setContext(JwtStrategy.name);
  }

  /**
   * Validates JWT payload and returns user entity
   *
   * This method is called by Passport after the JWT signature is verified.
   * We delegate the actual token validation to our existing JwtTokenService
   * to maintain consistency and reuse existing validation logic.
   *
   * @param payload - The decoded JWT payload
   * @returns Promise resolving to UserEntity for valid tokens
   * @throws InvalidTokenDomainException for invalid tokens
   * @throws TokenExpiredDomainException for expired tokens
   */
  validate(payload: JwtPayload): UserEntity {
    this.logger.assign({
      method: 'validate',
      userId: payload.sub,
      username: payload.user?.userName,
    });

    try {
      // Validate the payload structure
      if (!payload.sub || !payload.user) {
        this.logger.warn('Invalid JWT payload structure');
        throw new InvalidTokenDomainException();
      }

      // Additional validation can be added here if needed
      // For example: check if user is still active, not banned, etc.

      this.logger.debug('JWT token validated successfully');
      return payload.user;
    } catch (error: unknown) {
      if (
        error instanceof InvalidTokenDomainException ||
        error instanceof TokenExpiredDomainException
      ) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error({ error: errorMessage }, 'JWT validation failed');
      throw new InvalidTokenDomainException();
    }
  }
}
