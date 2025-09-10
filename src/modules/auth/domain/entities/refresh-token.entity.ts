import { RefreshTokenData } from '../types';

/**
 * Domain entity representing a refresh token in the system.
 */
export class RefreshTokenEntity {
  readonly id: string;
  readonly userId: string;
  readonly tokenHash: string;
  readonly expiresAt: Date;
  private _revokedAt?: Date;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  /**
   * Creates a new RefreshTokenEntity instance from refresh token data.
   */
  constructor(data: RefreshTokenData) {
    if (!data.id?.trim()) {
      throw new Error('RefreshToken ID is required and cannot be empty');
    }

    if (!data.userId?.trim()) {
      throw new Error('User ID is required and cannot be empty');
    }

    if (!data.tokenHash?.trim()) {
      throw new Error('Token hash is required and cannot be empty');
    }

    if (!data.expiresAt) {
      throw new Error('Expiration date is required');
    }

    if (data.createdAt && data.expiresAt <= data.createdAt) {
      throw new Error('Expiration date must be after creation date');
    }

    if (data.revokedAt && data.createdAt && data.revokedAt < data.createdAt) {
      throw new Error('Revocation date cannot be before creation date');
    }

    this.id = data.id.trim();
    this.userId = data.userId.trim();
    this.tokenHash = data.tokenHash.trim();
    this.expiresAt = new Date(data.expiresAt);
    this._revokedAt = data.revokedAt ? new Date(data.revokedAt) : undefined;

    if (data.createdAt) {
      this.createdAt = new Date(data.createdAt);
    }
    if (data.updatedAt) {
      this.updatedAt = new Date(data.updatedAt);
    }
  }

  get revokedAt(): Date | undefined {
    return this._revokedAt;
  }

  /**
   * Factory method to reconstruct entity from persistence layer.
   */
  static fromPersistence(refreshToken: RefreshTokenData): RefreshTokenEntity {
    return new RefreshTokenEntity(refreshToken);
  }

  /**
   * Checks if the refresh token is still valid (not expired and not revoked).
   */
  isValid(): boolean {
    const now = new Date();
    return !this._revokedAt && this.expiresAt > now;
  }

  /**
   * Checks if the refresh token has been revoked.
   */
  isRevoked(): boolean {
    return !!this._revokedAt;
  }

  /**
   * Checks if the refresh token has expired.
   */
  isExpired(): boolean {
    const now = new Date();
    return this.expiresAt <= now;
  }

  /**
   * Revokes the refresh token, making it invalid for future use.
   */
  revoke(): void {
    if (!this._revokedAt) {
      this._revokedAt = new Date();
    }
  }
}
