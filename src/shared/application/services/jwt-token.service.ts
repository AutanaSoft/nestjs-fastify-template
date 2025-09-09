import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';

import { jwtConfig } from '@/config';
import {
  InvalidTokenDomainException,
  TokenExpiredDomainException,
} from '@/modules/auth/domain/exceptions';
import { UserEntity } from '@/modules/user/domain/entities';
import { JwtTempTokenType } from '@/shared/domain/enums';
import { JwtPayload, TempTokenPayload } from '@/shared/domain/types';

/**
 * JWT service for handling generic JWT token operations
 * This service can be reused across different modules that need JWT functionality
 * Focuses only on JWT token generation and validation, not business logic
 */
@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: NestJwtService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(JwtTokenService.name);
  }

  // Public methods

  /**
   * Generates a JWT access token for the given user
   * @param user User entity containing user information
   * @returns Promise resolving to the signed JWT access token string
   */
  async generateAccessToken(user: UserEntity): Promise<string> {
    this.logger.assign({ method: 'generateAccessToken', userId: user.id });

    const tokenPayload: JwtPayload = {
      sub: user.id,
      user,
    };

    return this.generateToken(tokenPayload, this.config.expiresIn, 'access token');
  }

  /**
   * Generates a temporary JWT token for specific actions (password reset, email verification, etc.)
   * @param user User entity for whom the token is being generated
   * @param type Type of temporary token being generated
   * @returns Promise resolving to the signed JWT temporary token string
   */
  async generateTempToken(sub: string, user: UserEntity, type: JwtTempTokenType): Promise<string> {
    this.logger.assign({ method: 'generateTempToken' });

    try {
      const expiresIn = this.getTempTokenExpiration(type);

      const payload: TempTokenPayload = {
        sub,
        user,
        type,
      };

      return this.generateToken(payload, expiresIn, 'temporary token');
    } catch (error: unknown) {
      this.logger.error({ error }, 'Failed to generate temporary token');
      throw new Error('Failed to generate temporary token');
    }
  }

  /**
   * Validates and verifies a JWT token
   * @param token JWT token string to validate
   * @returns Promise resolving to the validated JWT payload
   * @throws TokenExpiredDomainException when token has expired
   * @throws InvalidTokenDomainException when token is invalid or malformed
   */
  async validateToken<T extends object = JwtPayload>(token: string): Promise<T> {
    this.logger.assign({ method: 'validateToken' });

    try {
      const payload = await this.jwtService.verifyAsync<T>(token, {
        secret: this.config.secret,
        issuer: this.config.issuer,
        audience: this.config.audience,
      });

      this.logger.debug('Token validated successfully');
      return payload;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        this.logger.warn('Token has expired');
        throw new TokenExpiredDomainException();
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn({ error: errorMessage }, 'Invalid token');
      throw new InvalidTokenDomainException();
    }
  }

  // Private methods

  /**
   * Generates a JWT token with the specified payload and options
   * This is a generic method used internally by other token generation methods
   * @param payload The payload to include in the token
   * @param expiresIn Expiration time for the token (e.g., '15m', '1h', '7d')
   * @param tokenType Type of token being generated (for logging purposes)
   * @returns Promise resolving to the signed JWT token string
   * @private
   */
  private async generateToken<T extends object>(
    payload: T,
    expiresIn: string,
    tokenType: string,
  ): Promise<string> {
    this.logger.assign({ method: 'generateToken', tokenType });

    try {
      const token = await this.jwtService.signAsync(payload, {
        expiresIn,
        issuer: this.config.issuer,
        audience: this.config.audience,
      });

      this.logger.info(`${tokenType} generated successfully`);
      return token;
    } catch (error: unknown) {
      this.logger.error({ error }, `Failed to generate ${tokenType}`);
      throw new Error(`Failed to generate ${tokenType}`);
    }
  }

  /**
   * Helper method to get expiration time for temporary tokens based on type
   * @param type Type of temporary token
   * @returns Expiration time string (e.g., '15m', '1h', '7d')
   * @private
   */
  private getTempTokenExpiration(type: JwtTempTokenType): string {
    switch (type) {
      case JwtTempTokenType.FORGOT_PASSWORD:
        return this.config.tempTokens.forgotPassword;
      case JwtTempTokenType.RESET_PASSWORD:
        return this.config.tempTokens.resetPassword;
      case JwtTempTokenType.REFRESH_TOKEN:
        return this.config.tempTokens.refreshToken;
      default:
        return '15m'; // Default fallback
    }
  }
}
