import { UserEntity } from '@/modules/user/domain/entities';

/**
 * Enum defining different types of temporary JWT tokens used for various authentication flows
 */
export enum JwtTempTokenType {
  FORGOT_PASSWORD = 'forgot_password',
  RESET_PASSWORD = 'reset_password',
  REFRESH_TOKEN = 'refresh_token',
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
 * Temporary token payload structure for specific actions
 * Uses a unique identifier (UUID) instead of user ID for database validation
 */
export interface TempTokenPayload extends JwtPayload {
  /** Unique token identifier (UUID) for database validation */
  sub: string;
  /** Type of temporary token */
  type: JwtTempTokenType;
}
