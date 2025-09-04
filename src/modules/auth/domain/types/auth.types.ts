/**
 * Authentication credentials for user sign-in
 * Supports both email and username for flexible authentication
 */
export interface AuthSignInData {
  /** Email address or username for authentication */
  readonly identifier: string;
  /** Plain text password provided by the user */
  readonly password: string;
}

/**
 * User registration data for sign-up process
 */
export interface AuthSignUpData {
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
