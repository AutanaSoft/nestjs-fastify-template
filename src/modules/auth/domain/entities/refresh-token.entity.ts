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
   * The actual refresh token string.
   * Should be cryptographically secure and unique.
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  token: string;

  /**
   * Timestamp when the refresh token expires.
   * After this date, the token should not be accepted.
   * @example new Date('2024-01-01T00:00:00Z')
   */
  expiresAt: Date;

  /**
   * Timestamp when the refresh token was created.
   * @example new Date('2023-12-01T00:00:00Z')
   */
  createdAt: Date;

  /**
   * Timestamp when the refresh token was last updated.
   * @example new Date('2023-12-15T10:30:00Z')
   */
  updatedAt: Date;

  /**
   * Flag indicating whether the refresh token has been revoked.
   * Revoked tokens should not be accepted for token refresh.
   */
  isRevoked: boolean;

  /**
   * Checks if the refresh token is still valid (not expired and not revoked).
   * @returns true if the token is valid, false otherwise
   */
  isValid(): boolean {
    const now = new Date();
    return !this.isRevoked && this.expiresAt > now;
  }

  /**
   * Revokes the refresh token, making it invalid for future use.
   */
  revoke(): void {
    this.isRevoked = true;
    this.updatedAt = new Date();
  }
}
