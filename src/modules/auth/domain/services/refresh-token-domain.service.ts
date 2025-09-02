import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { RefreshTokenEntity } from '../entities';
import { InvalidRefreshTokenDomainException, TokenExpiredDomainException } from '../exceptions';
import { RefreshTokenRepository } from '../repositories';

/**
 * Domain service for refresh token business logic and validations
 * Handles domain-specific operations that don't belong to a single entity
 */
@Injectable()
export class RefreshTokenDomainService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(RefreshTokenDomainService.name);
  }

  /**
   * Validates a refresh token according to domain rules
   * @param tokenHash - The SHA-256 hash of the refresh token to validate
   * @returns Promise resolving to the refresh token entity if valid
   * @throws InvalidRefreshTokenDomainException if token is invalid or revoked
   * @throws TokenExpiredDomainException if token has expired
   */
  async validateRefreshToken(tokenHash: string): Promise<RefreshTokenEntity> {
    this.logger.assign({ method: 'validateRefreshToken' });

    // Find the token in the repository
    const refreshTokenEntity = await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!refreshTokenEntity) {
      this.logger.warn('Refresh token not found');
      throw new InvalidRefreshTokenDomainException();
    }

    // Domain rule: Check if token has expired
    if (refreshTokenEntity.isExpired()) {
      this.logger.warn(
        { tokenId: refreshTokenEntity.id, expiresAt: refreshTokenEntity.expiresAt },
        'Refresh token has expired',
      );
      throw new TokenExpiredDomainException();
    }

    // Domain rule: Check if token is revoked
    if (refreshTokenEntity.isRevoked()) {
      this.logger.warn({ tokenId: refreshTokenEntity.id }, 'Refresh token has been revoked');
      throw new InvalidRefreshTokenDomainException();
    }

    this.logger.debug(
      { tokenId: refreshTokenEntity.id, userId: refreshTokenEntity.userId },
      'Refresh token validated successfully',
    );

    return refreshTokenEntity;
  }

  /**
   * Revokes a refresh token by marking it as revoked
   * @param tokenHash - The SHA-256 hash of the refresh token to revoke
   * @throws InvalidRefreshTokenDomainException if token is not found
   */
  async revokeRefreshToken(tokenHash: string): Promise<void> {
    this.logger.assign({ method: 'revokeRefreshToken' });

    // First, find the token to ensure it exists
    const refreshTokenEntity = await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!refreshTokenEntity) {
      this.logger.warn('Refresh token not found for revocation');
      throw new InvalidRefreshTokenDomainException();
    }

    // Domain rule: Only revoke if not already revoked
    if (!refreshTokenEntity.isRevoked()) {
      await this.refreshTokenRepository.update(refreshTokenEntity.id, {
        revokedAt: new Date(),
      });

      this.logger.info({ tokenId: refreshTokenEntity.id }, 'Refresh token revoked successfully');
    } else {
      this.logger.warn({ tokenId: refreshTokenEntity.id }, 'Refresh token already revoked');
    }
  }

  /**
   * Revokes all refresh tokens for a specific user
   * @param userId - The unique identifier of the user
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    this.logger.assign({ method: 'revokeAllUserTokens', userId });

    // Use repository's updateMany to efficiently revoke all active tokens for the user
    const updatedCount = await this.refreshTokenRepository.updateMany(
      { userId, revokedAt: null },
      { revokedAt: new Date() },
    );

    this.logger.info(
      { userId, revokedCount: updatedCount },
      'All user refresh tokens revoked successfully',
    );
  }

  /**
   * Finds all active refresh tokens for a user (not expired and not revoked)
   * @param userId - The unique identifier of the user
   * @returns Promise resolving to array of active refresh token entities
   */
  async findActiveTokensByUserId(userId: string): Promise<RefreshTokenEntity[]> {
    this.logger.assign({ method: 'findActiveTokensByUserId', userId });

    // Get all tokens for the user from repository
    const userTokens = await this.refreshTokenRepository.findByUserId(userId);

    // Apply domain rules to filter only active tokens
    const activeTokens = userTokens.filter(token => token.isValid());

    this.logger.debug(
      { userId, totalTokens: userTokens.length, activeTokens: activeTokens.length },
      'Active tokens found for user',
    );

    return activeTokens;
  }

  /**
   * Determines if a refresh token is valid without throwing exceptions
   * @param tokenHash - The SHA-256 hash of the refresh token to check
   * @returns Promise resolving to true if valid, false otherwise
   */
  async isRefreshTokenValid(tokenHash: string): Promise<boolean> {
    try {
      await this.validateRefreshToken(tokenHash);
      return true;
    } catch {
      return false;
    }
  }
}
