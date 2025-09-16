/**
 * Domain entity representing a refresh token in the system.
 * Contains all refresh token-related data and business logic at the domain level.
 * This entity is framework-agnostic and contains pure business rules.
 */
export class RefreshTokenEntity {
  /**
   * Unique identifier for the refresh token.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;

  /**
   * The unique identifier of the user who owns this refresh token.
   * @example "user123"
   */
  userId: string;

  /**
   * The SHA-256 hash of the refresh token string.
   * Stored as hex string for security purposes.
   * @example "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
   */
  tokenHash: string;

  /**
   * Timestamp when the refresh token was created.
   * @example new Date('2023-12-01T00:00:00Z')
   */
  createdAt: Date;

  /**
   * Timestamp when the refresh token expires.
   * After this date, the token should not be accepted.
   * @example new Date('2024-01-01T00:00:00Z')
   */
  expiresAt: Date;

  /**
   * Timestamp when the refresh token was revoked (optional).
   * If null, the token has not been revoked.
   * @example new Date('2023-12-15T10:30:00Z')
   */
  revokedAt?: Date;
}
