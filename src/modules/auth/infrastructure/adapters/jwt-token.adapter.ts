import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID, createHash } from 'crypto';
import { PinoLogger } from 'nestjs-pino';

import { jwtConfig } from '@/config';
import { UserEntity } from '@/modules/user/domain/entities';
import { RefreshTokenEntity } from '../../domain/entities';
import {
  InvalidRefreshTokenDomainException,
  InvalidTokenDomainException,
  TokenExpiredDomainException,
} from '../../domain/exceptions';
import { TokenRepository } from '../../domain/repositories';
import { JwtPayload, JwtTempTokenType, TempTokenPayload, TokenPair } from '../../domain/types';

/**
 * JWT token adapter implementing the TokenRepository interface
 * Handles JWT token generation, validation, and refresh operations
 */
@Injectable()
export class JwtTokenAdapter implements TokenRepository {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(JwtTokenAdapter.name);
  }

  /**
   * Generates a JWT access token for the given user payload
   */
  async generateAccessToken(payload: JwtPayload): Promise<string> {
    this.logger.assign({ method: 'generateAccessToken' });

    try {
      const token = await this.jwtService.signAsync(
        {
          sub: payload.sub,
          user: payload.user,
          iat: payload.iat,
        },
        {
          expiresIn: this.config.expiresIn,
          issuer: this.config.issuer,
          audience: this.config.audience,
        },
      );

      this.logger.info({ userId: payload.sub }, 'Access token generated successfully');
      return token;
    } catch (error: unknown) {
      this.logger.error({ error }, 'Failed to generate access token');
      throw new Error('Failed to generate access token');
    }
  }

  /**
   * Generates a temporary JWT token for specific actions
   */
  async generateTempToken(user: UserEntity, type: JwtTempTokenType): Promise<string> {
    this.logger.assign({ method: 'generateTempToken', userId: user.id, type });

    try {
      const expiresIn = this.getTempTokenExpiration(type);
      const tokenId = randomUUID(); // Generate unique UUID for token identification

      const payload: TempTokenPayload = {
        sub: tokenId, // Unique token identifier for database validation
        user, // Complete user entity
        type,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + this.parseTimeToSeconds(expiresIn),
      };

      const token = await this.jwtService.signAsync(payload, {
        expiresIn,
        issuer: this.config.issuer,
        audience: this.config.audience,
      });

      this.logger.assign({ tokenId });
      this.logger.info('Temporary token generated successfully');
      return token;
    } catch (error: unknown) {
      this.logger.error({ error }, 'Failed to generate temporary token');
      throw new Error('Failed to generate temporary token');
    }
  }

  /**
   * Validates a temporary JWT token and ensures it's of the expected type
   */
  async validateTempToken(
    token: string,
    expectedType: JwtTempTokenType,
  ): Promise<TempTokenPayload> {
    this.logger.assign({ method: 'validateTempToken', expectedType });

    try {
      const payload = await this.jwtService.verifyAsync<TempTokenPayload>(token, {
        secret: this.config.secret,
        issuer: this.config.issuer,
        audience: this.config.audience,
      });

      // Verify token type matches expected type
      if (payload.type !== expectedType) {
        this.logger.assign({ actualType: payload.type });
        this.logger.warn('Token type mismatch');
        throw new InvalidTokenDomainException();
      }

      this.logger.info(
        { tokenId: payload.sub, userId: payload.user.id, type: payload.type },
        'Temporary token validated successfully',
      );
      return payload;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        this.logger.warn('Temporary token has expired');
        throw new TokenExpiredDomainException();
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn({ error: errorMessage }, 'Invalid temporary token');
      throw new InvalidTokenDomainException();
    }
  }

  /**
   * Generates a new refresh token for the given user
   * Now uses JWT temporary token instead of random bytes
   */
  async generateRefreshToken(user: UserEntity): Promise<RefreshTokenEntity> {
    this.logger.assign({ method: 'generateRefreshToken' });

    try {
      // Generate JWT temporary token for refresh token
      const jwtToken = await this.generateTempToken(user, JwtTempTokenType.REFRESH_TOKEN);

      const now = new Date();
      const expiresAt = new Date(
        now.getTime() + this.parseTimeToMs(this.config.tempTokens.refreshToken),
      );

      const refreshToken = new RefreshTokenEntity();
      refreshToken.id = randomUUID();
      refreshToken.userId = user.id;
      refreshToken.tokenHash = createHash('sha256').update(jwtToken).digest('hex');
      refreshToken.expiresAt = expiresAt;
      refreshToken.createdAt = now;

      this.logger.debug(
        { tokenId: refreshToken.id, userId: user.id },
        'Refresh token generated successfully',
      );
      return refreshToken;
    } catch (error: unknown) {
      this.logger.error({ error, userId: user.id }, 'Failed to generate refresh token');
      throw new Error('Failed to generate refresh token');
    }
  }

  /**
   * Generates both access and refresh tokens for a user
   */
  async generateTokenPair(payload: JwtPayload): Promise<TokenPair> {
    this.logger.assign({ method: 'generateTokenPair' });

    try {
      // Generate access token
      const accessToken = await this.generateAccessToken(payload);

      // Generate JWT temporary token for refresh token (this is what the client will use)
      const refreshJwtToken = await this.generateTempToken(
        payload.user,
        JwtTempTokenType.REFRESH_TOKEN,
      );

      const now = new Date();
      const expiresAt = new Date(now.getTime() + this.parseTimeToMs(this.config.expiresIn));

      const tokenPair: TokenPair = {
        accessToken,
        refreshToken: refreshJwtToken, // Return the actual JWT token for the client
        expiresAt,
        createdAt: now,
      };

      this.logger.debug({ tokenPair }, 'Token pair generated successfully');
      return tokenPair;
    } catch (error: unknown) {
      this.logger.error({ error }, 'Failed to generate token pair');
      throw new Error('Failed to generate token pair');
    }
  }

  /**
   * Validates and verifies a JWT access token
   */
  async validateAccessToken(token: string): Promise<JwtPayload | null> {
    this.logger.assign({ method: 'validateAccessToken' });

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.config.secret,
        issuer: this.config.issuer,
        audience: this.config.audience,
      });

      this.logger.debug({ userId: payload.sub }, 'Access token validated successfully');
      return payload;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        this.logger.warn('Access token has expired');
        throw new TokenExpiredDomainException();
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn({ error: errorMessage }, 'Invalid access token');
      throw new InvalidTokenDomainException();
    }
  }

  /**
   * Placeholder methods for refresh token operations
   * These will be implemented when we add database persistence
   */
  validateRefreshToken(token: string): Promise<RefreshTokenEntity | null> {
    this.logger.assign({ method: 'validateRefreshToken', token });
    this.logger.warn('Refresh token validation not implemented yet');
    throw new InvalidRefreshTokenDomainException();
  }

  revokeRefreshToken(token: string): Promise<void> {
    this.logger.assign({ method: 'revokeRefreshToken' });
    this.logger.info(
      { token: token.substring(0, 10) + '...' },
      'Refresh token revoked (placeholder)',
    );
    return Promise.resolve();
  }

  revokeAllUserTokens(userId: string): Promise<void> {
    this.logger.assign({ method: 'revokeAllUserTokens', userId });
    this.logger.info('All user refresh tokens revoked (placeholder)');
    return Promise.resolve();
  }

  refreshAccessToken(refreshToken: string): Promise<TokenPair | null> {
    this.logger.assign({ method: 'refreshAccessToken', refreshToken });
    this.logger.warn('Token refresh not implemented yet');
    return Promise.resolve(null);
  }

  storeRefreshToken(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity> {
    this.logger.assign({ method: 'storeRefreshToken', tokenId: refreshToken.id });
    this.logger.debug({ tokenId: refreshToken.id }, 'Refresh token stored (placeholder)');
    return Promise.resolve(refreshToken);
  }

  findRefreshToken(token: string): Promise<RefreshTokenEntity | null> {
    this.logger.assign({ method: 'findRefreshToken', token });
    this.logger.debug('Finding refresh token (placeholder)');
    return Promise.resolve(null);
  }

  /**
   * Helper method to get expiration time for temporary tokens based on type
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

  /**
   * Helper method to parse time string to seconds
   */
  private parseTimeToSeconds(time: string): number {
    return Math.floor(this.parseTimeToMs(time) / 1000);
  }

  /**
   * Helper method to parse time string to milliseconds
   */
  private parseTimeToMs(time: string): number {
    const unit = time.slice(-1);
    const value = parseInt(time.slice(0, -1), 10);

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return parseInt(time, 10) * 1000; // fallback to seconds
    }
  }
}
