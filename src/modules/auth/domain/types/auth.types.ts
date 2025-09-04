/**
 * Authentication credentials for user sign-in
 * Supports both email and username for flexible authentication
 */
export interface AuthCredentials {
  /** Email address or username for authentication */
  readonly identifier: string;
  /** Plain text password provided by the user */
  readonly password: string;
}

/**
 * User registration data for sign-up process
 */
export interface UserRegistrationData {
  /** User's email address - must be unique */
  readonly email: string;
  /** User's chosen username - must be unique */
  readonly userName: string;
  /** Plain text password that will be hashed */
  readonly password: string;
}

/**
 * Complete authentication response containing tokens and metadata
 */
export interface AuthResponse {
  /** JWT access token for API authentication */
  readonly token: string;
  /** Refresh token for obtaining new access tokens */
  readonly refreshToken: string;
  /** Expiration date of the access token */
  readonly expiresAt: Date;
  /** Creation date of the tokens */
  readonly createdAt: Date;
}

/**
 * Token pair containing access and refresh tokens
 */
export interface TokenPair {
  /** JWT access token */
  readonly accessToken: string;
  /** Refresh token */
  readonly refreshToken: string;
  /** Access token expiration date */
  readonly expiresAt: Date;
  /** Token creation date */
  readonly createdAt: Date;
}

/**
 * Refresh token data for token management
 * Matches the RefreshTokenEntity structure for type consistency
 */
export interface RefreshTokenData {
  /** Token identifier */
  readonly id: string;
  /** Associated user ID */
  readonly userId: string;
  /** The SHA-256 hash of the refresh token string */
  readonly tokenHash: string;
  /** Token creation date */
  readonly createdAt: Date;
  /** Token expiration date */
  readonly expiresAt: Date;
  /** Token revocation date (optional) */
  readonly revokedAt?: Date;
}
