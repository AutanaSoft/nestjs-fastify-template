import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, randomUUID } from 'crypto';
import { PinoLogger } from 'nestjs-pino';

import { jwtConfig } from '@/config';
import { RefreshTokenEntity } from '../../domain/entities';
import {
  InvalidRefreshTokenDomainException,
  InvalidTokenDomainException,
  TokenExpiredDomainException,
} from '../../domain/exceptions';
import { TokenRepository } from '../../domain/repositories';
import { JwtPayload, TokenPair } from '../../domain/types';

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

      this.logger.debug({ token }, 'Access token generated successfully');
      return token;
    } catch (error: unknown) {
      this.logger.error({ error }, 'Failed to generate access token');
      throw new Error('Failed to generate access token');
    }
  }

  /**
   * Generates a new refresh token for the given user
   */
  generateRefreshToken(userId: string): Promise<RefreshTokenEntity> {
    this.logger.assign({ method: 'generateRefreshToken' });

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

    this.logger.debug({ refreshToken }, 'Refresh token generated successfully');
    return Promise.resolve(refreshToken);
  }

  /**
   * Generates both access and refresh tokens for a user
   */
  async generateTokenPair(payload: JwtPayload): Promise<TokenPair> {
    this.logger.assign({ method: 'generateTokenPair' });

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
