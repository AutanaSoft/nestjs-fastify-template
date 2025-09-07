/**
 * Refresh token data structure for entity creation and updates.
 */
export interface RefreshTokenData {
  readonly id: string;
  readonly userId: string;
  readonly tokenHash: string;
  readonly expiresAt: Date;
  readonly revokedAt?: Date | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

/**
 * Data structure for creating new refresh tokens.
 * All fields are required for creating a new entity instance.
 */
export type RefreshTokenCreateData = {
  readonly id: string;
  readonly userId: string;
  readonly tokenHash: string;
  readonly expiresAt: Date;
  readonly revokedAt?: Date;
};

/**
 * Data structure for updating existing refresh tokens.
 * Only revokedAt can be updated.
 */
export type RefreshTokenUpdateData = {
  readonly id: string;
  readonly revokedAt: Date;
};
