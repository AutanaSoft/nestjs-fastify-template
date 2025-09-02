import { UserEntity } from '@/modules/user/domain/entities';

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
 * JWT token payload structure containing user information
 */
export interface JwtPayload {
  /** User's unique identifier (user ID) */
  sub: string;
  /** Complete user entity with all user information */
  user: UserEntity;
  /** Token issued at timestamp */
  iat?: number;
  /** Token expiration timestamp */
  exp?: number;
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
 */
export interface RefreshTokenData {
  /** Token identifier */
  readonly id: string;
  /** Associated user ID */
  readonly userId: string;
  /** The refresh token string */
  readonly token: string;
  /** Token expiration date */
  readonly expiresAt: Date;
  /** Token creation date */
  readonly createdAt: Date;
  /** Whether the token is revoked */
  readonly isRevoked: boolean;
}
