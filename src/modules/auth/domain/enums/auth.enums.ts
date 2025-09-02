import { registerEnumType } from '@nestjs/graphql';

/**
 * Authentication error codes for specific authentication failures
 */
export enum AuthErrorCode {
  /** Invalid email or password provided */
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  /** User account is not active */
  ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE',
  /** User account has been banned */
  ACCOUNT_BANNED = 'ACCOUNT_BANNED',
  /** Email address is already registered */
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  /** Username is already taken */
  USERNAME_ALREADY_EXISTS = 'USERNAME_ALREADY_EXISTS',
  /** Invalid or expired refresh token */
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  /** JWT token has expired */
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  /** JWT token is invalid */
  INVALID_TOKEN = 'INVALID_TOKEN',
}

/**
 * Register GraphQL enum types for authentication error codes
 */
registerEnumType(AuthErrorCode, {
  name: 'AuthErrorCode',
  description: 'Authentication error codes for specific authentication failures',
});

/**
 * Token types used in the authentication system
 */
export enum TokenType {
  /** Access token for API authentication */
  ACCESS = 'ACCESS',
  /** Refresh token for obtaining new access tokens */
  REFRESH = 'REFRESH',
}

/**
 * Register GraphQL enum types for token types
 */
registerEnumType(TokenType, {
  name: 'TokenType',
  description: 'Token types used in the authentication system',
});
