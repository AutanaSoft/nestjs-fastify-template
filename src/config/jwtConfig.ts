/**
 * JWT Authentication Configuration Module
 *
 * This module provides JWT token configuration for authentication including:
 * - JWT secret key for token signing and verification
 * - Token expiration times (access and refresh tokens)
 * - JWT claims (issuer and audience)
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
 *
 * @returns The JWT configuration object
 */
export default registerAs(
  'jwtConfig',
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'nestjs-auth-api',
    audience: process.env.JWT_AUDIENCE || 'nestjs-auth-client',
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
