/**
 * JWT Authentication Configuration Module
 *
 * This module provides JWT token configuration for authentication including:
 * - JWT secret key for token signing and verification
 * - Token expiration times (access and refresh tokens)
 * - JWT claims (issuer and audience)
 * - Temporary token configurations for specific actions
 * - NestJS JWT module options factory
 */

import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

/**
 * JWT configuration type definition
 * Defines the structure for all JWT-related configuration values
 */
export type JwtConfig = {
  /** Secret key for signing JWT tokens */
  secret: string;
  /** Access token expiration time (e.g., '15m', '1h') */
  expiresIn: string;
  /** Refresh token expiration time (e.g., '7d', '30d') */
  refreshExpiresIn: string;
  /** JWT issuer claim identifying the token issuer */
  issuer: string;
  /** JWT audience claim identifying the intended token recipients */
  audience: string;
  /** Temporary token configurations for specific actions */
  tempTokens: {
    /** Password recovery token expiration */
    forgotPassword: string;
    /** Password reset token expiration */
    resetPassword: string;
    /** Refresh token expiration */
    refreshToken: string;
  };
};

/**
 * JWT configuration factory
 * Registers configuration using NestJS Config module with 'jwtConfig' namespace
 *
 * Environment variables:
 * - JWT_SECRET: Secret key for signing tokens (REQUIRED in production)
 * - JWT_EXPIRES_IN: Access token expiration (default: '15m')
 * - JWT_REFRESH_EXPIRES_IN: Refresh token expiration (default: '7d')
 * - JWT_ISSUER: Token issuer identifier (default: 'nestjs-auth-api')
 * - JWT_AUDIENCE: Token audience identifier (default: 'nestjs-auth-client')
 * - JWT_TEMP_TOKEN_FORGOT_PASSWORD: Password recovery token expiration (default: '15m')
 * - JWT_TEMP_TOKEN_RESET_PASSWORD: Password reset token expiration (default: '15m')
 * - JWT_TEMP_TOKEN_REFRESH_TOKEN: Refresh token expiration (default: '7d')
 *
 * @returns The JWT configuration object
 */
export default registerAs(
  'jwtConfig',
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'nestjs-auth-api',
    audience: process.env.JWT_AUDIENCE || 'nestjs-auth-client',
    tempTokens: {
      forgotPassword: process.env.JWT_TEMP_TOKEN_FORGOT_PASSWORD || '15m',
      resetPassword: process.env.JWT_TEMP_TOKEN_RESET_PASSWORD || '15m',
      refreshToken: process.env.JWT_TEMP_TOKEN_REFRESH_TOKEN || '7d',
    },
  }),
);

/**
 * Creates JWT module options from configuration
 * Factory function to convert JWT configuration into NestJS JWT module options
 *
 * @param config - JWT configuration object
 * @returns JWT module options for NestJS JWT module registration
 */
export const createJwtModuleOptions = (config: JwtConfig): JwtModuleOptions => ({
  secret: config.secret,
  signOptions: {
    expiresIn: config.expiresIn,
    issuer: config.issuer,
    audience: config.audience,
  },
  verifyOptions: {
    issuer: config.issuer,
    audience: config.audience,
  },
});
