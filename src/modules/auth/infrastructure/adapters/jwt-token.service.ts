import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { randomBytes, randomUUID } from 'crypto';

import { jwtConfig } from '@/config';
import { TokenRepository } from '../../domain/repositories';
import { JwtPayload, TokenPair } from '../../domain/types';
import { RefreshTokenEntity } from '../../domain/entities';
import {
  InvalidTokenDomainException,
  TokenExpiredDomainException,
  InvalidRefreshTokenDomainException,
} from '../../domain/exceptions';

/**
 * JWT token service implementing the TokenRepository interface
 * Handles JWT token generation, validation, and refresh operations
 */
@Injectable()
export class JwtTokenService implements TokenRepository {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(JwtTokenService.name);
  }

  /**
   * Generates a JWT access token for the given user payload
   */
  async generateAccessToken(payload: JwtPayload): Promise<string> {
    const logger = this.logger;
    logger.assign({ method: 'generateAccessToken', userId: payload.sub });

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

      logger.debug({ userId: payload.sub }, 'Access token generated successfully');
      return token;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ error: errorMessage, userId: payload.sub }, 'Failed to generate access token');
      throw new Error('Failed to generate access token');
    }
  }

  /**
   * Generates a new refresh token for the given user
   */
  generateRefreshToken(userId: string): Promise<RefreshTokenEntity> {
    const logger = this.logger;
    logger.assign({ method: 'generateRefreshToken', userId });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.parseTimeToMs(this.config.refreshExpiresIn));

    const refreshToken = new RefreshTokenEntity();
    refreshToken.id = randomUUID();
    refreshToken.userId = userId;
    refreshToken.token = randomBytes(32).toString('hex');
    refreshToken.expiresAt = expiresAt;
    refreshToken.createdAt = now;
    refreshToken.updatedAt = now;
    refreshToken.isRevoked = false;

    logger.debug({ userId, tokenId: refreshToken.id }, 'Refresh token generated successfully');
    return Promise.resolve(refreshToken);
  }

  /**
   * Generates both access and refresh tokens for a user
   */
  async generateTokenPair(payload: JwtPayload): Promise<TokenPair> {
    const logger = this.logger;
    logger.assign({ method: 'generateTokenPair', userId: payload.sub });

    try {
      const [accessToken, refreshTokenEntity] = await Promise.all([
        this.generateAccessToken(payload),
        this.generateRefreshToken(payload.sub),
      ]);

      const now = new Date();
      const expiresAt = new Date(now.getTime() + this.parseTimeToMs(this.config.expiresIn));

      const tokenPair: TokenPair = {
        accessToken,
        refreshToken: refreshTokenEntity.token,
        expiresAt,
        createdAt: now,
      };

      logger.debug({ userId: payload.sub }, 'Token pair generated successfully');
      return tokenPair;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ error: errorMessage, userId: payload.sub }, 'Failed to generate token pair');
      throw new Error('Failed to generate token pair');
    }
  }

  /**
   * Validates and verifies a JWT access token
   */
  async validateAccessToken(token: string): Promise<JwtPayload | null> {
    const logger = this.logger;
    logger.assign({ method: 'validateAccessToken' });

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.config.secret,
        issuer: this.config.issuer,
        audience: this.config.audience,
      });

      logger.debug({ userId: payload.sub }, 'Access token validated successfully');
      return payload;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        logger.warn('Access token has expired');
        throw new TokenExpiredDomainException();
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.warn({ error: errorMessage }, 'Invalid access token');
      throw new InvalidTokenDomainException();
    }
  }

  /**
   * Placeholder methods for refresh token operations
   * These will be implemented when we add database persistence
   */
  validateRefreshToken(token: string): Promise<RefreshTokenEntity | null> {
    const logger = this.logger;
    logger.assign({ method: 'validateRefreshToken', token: token.substring(0, 10) + '...' });
    logger.warn('Refresh token validation not implemented yet');
    throw new InvalidRefreshTokenDomainException();
  }

  revokeRefreshToken(token: string): Promise<void> {
    const logger = this.logger;
    logger.assign({ method: 'revokeRefreshToken' });
    logger.info({ token: token.substring(0, 10) + '...' }, 'Refresh token revoked (placeholder)');
    return Promise.resolve();
  }

  revokeAllUserTokens(userId: string): Promise<void> {
    const logger = this.logger;
    logger.assign({ method: 'revokeAllUserTokens', userId });
    logger.info({ userId }, 'All user refresh tokens revoked (placeholder)');
    return Promise.resolve();
  }

  refreshAccessToken(refreshToken: string): Promise<TokenPair | null> {
    const logger = this.logger;
    logger.assign({ method: 'refreshAccessToken', token: refreshToken.substring(0, 10) + '...' });
    logger.warn('Token refresh not implemented yet');
    return Promise.resolve(null);
  }

  storeRefreshToken(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity> {
    const logger = this.logger;
    logger.assign({ method: 'storeRefreshToken', tokenId: refreshToken.id });
    logger.debug({ tokenId: refreshToken.id }, 'Refresh token stored (placeholder)');
    return Promise.resolve(refreshToken);
  }

  findRefreshToken(token: string): Promise<RefreshTokenEntity | null> {
    const logger = this.logger;
    logger.assign({ method: 'findRefreshToken', token: token.substring(0, 10) + '...' });
    logger.debug('Finding refresh token (placeholder)');
    return Promise.resolve(null);
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
