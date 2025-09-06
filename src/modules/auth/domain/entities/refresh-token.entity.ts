import { RefreshTokenData, RefreshTokenCreateData } from '../types';

/**
 * Domain entity representing a refresh token in the system.
 */
export class RefreshTokenEntity {
  readonly id: string;
  readonly userId: string;
  readonly tokenHash: string;
  readonly createdAt: Date;
  readonly expiresAt: Date;
  private _revokedAt?: Date;

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

    if (!data.createdAt) {
      throw new Error('Creation date is required');
    }

    if (!data.expiresAt) {
      throw new Error('Expiration date is required');
    }

    if (data.expiresAt <= data.createdAt) {
      throw new Error('Expiration date must be after creation date');
    }

    if (data.revokedAt && data.revokedAt < data.createdAt) {
      throw new Error('Revocation date cannot be before creation date');
    }

    this.id = data.id.trim();
    this.userId = data.userId.trim();
    this.tokenHash = data.tokenHash.trim();
    this.createdAt = new Date(data.createdAt);
    this.expiresAt = new Date(data.expiresAt);
    this._revokedAt = data.revokedAt ? new Date(data.revokedAt) : undefined;
  }

  get revokedAt(): Date | undefined {
    return this._revokedAt;
  }

  /**
   * Factory method to create a new refresh token for a user.
   */
  static createNew(data: RefreshTokenCreateData): RefreshTokenEntity {
    return new RefreshTokenEntity({
      id: data.id,
      userId: data.userId,
      tokenHash: data.tokenHash,
      createdAt: data.createdAt,
      expiresAt: data.expiresAt,
    });
  }

  /**
   * Factory method to reconstruct entity from persistence layer.
   */
  static fromPersistence(data: RefreshTokenData): RefreshTokenEntity {
    return new RefreshTokenEntity(data);
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
