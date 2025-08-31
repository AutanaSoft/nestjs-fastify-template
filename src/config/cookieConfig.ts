/**
 * Cookie Configuration Module
 *
 * This module configures the @fastify/cookie plugin for secure cookie handling with:
 * - Environment-aware cookie security settings
 * - Proper SameSite attribute configuration
 * - Cookie signing with secret key
 * - Configurable HTTP-only setting
 * - Domain-specific cookie configuration
 */

import { FastifyCookieOptions } from '@fastify/cookie';
import { registerAs } from '@nestjs/config';

/**
 * Determines the appropriate SameSite cookie attribute based on environment configuration
 *
 * The SameSite attribute is critical for security as it controls when cookies are sent
 * with cross-site requests, helping to prevent CSRF attacks.
 *
 * Options:
 * - 'strict': Cookies only sent in first-party context (highest security, may impact UX)
 * - 'lax': Cookies sent with navigation to origin site (good security/UX balance)
 * - 'none': Cookies sent in all contexts, must use with Secure flag (lowest security)
 *
 * Environment variables:
 * - COOKIE_SAME_SITE: Explicitly sets the SameSite value if valid
 * - APP_ENV: Used for default selection if COOKIE_SAME_SITE not provided
 *
 * @returns The appropriate SameSite value based on environment and configuration
 */
const getSameSite = (): 'lax' | 'none' | 'strict' | undefined => {
  const allowedSameSite = ['lax', 'none', 'strict'];
  const sameSite = process.env.COOKIE_SAME_SITE;

  // Check if the environment variable is set and valid
  if (sameSite && allowedSameSite.includes(sameSite)) {
    return sameSite as 'lax' | 'none' | 'strict';
  }

  // If not set or invalid, default to 'lax' for production and 'none' otherwise
  return process.env.APP_ENV === 'production' ? 'lax' : 'none';
};

/**
 * Cookie configuration factory
 * Registers configuration using NestJS Config module with 'cookieConfig' namespace
 *
 * Environment variables:
 * - APP_ENV: Environment name (production settings are more secure)
 * - COOKIE_SECRET: Secret key for signing cookies (default: generated secure string)
 * - COOKIE_HTTP_ONLY: If 'true', cookies are not accessible via JavaScript (default: false)
 * - COOKIE_SAME_SITE: SameSite attribute ('lax', 'none', 'strict')
 *   (default: 'lax' in production, 'none' otherwise)
 * - COOKIE_DOMAIN: Domain scope for cookies (default: undefined = current domain)
 *
 * @returns Configuration options for @fastify/cookie plugin
 */
export default registerAs('cookieConfig', (): FastifyCookieOptions => {
  // Detect production environment for enhanced security settings
  const isProduction = process.env.APP_ENV === 'production';

  // Secret key used for signing cookies - should be a strong, unpredictable value in production
  const secret = process.env.COOKIE_SECRET || 'MAw5YjhDo8QZoTnuvXlsZwnPvfkynQmUWQjnQIyeoPs=';

  // HTTP-only cookies can't be accessed by JavaScript, improving security against XSS attacks
  const isHttpOnly = process.env.COOKIE_HTTP_ONLY === 'true';

  return {
    // Secret key for cookie signing
    secret,

    // Attach cookie parsing to onRequest hook for early availability in request lifecycle
    hook: 'onRequest',

    // Cookie parsing and creation options
    parseOptions: {
      // In production, cookies should only be sent over HTTPS
      secure: isProduction,

      // Prevent JavaScript access to cookies when enabled
      httpOnly: isHttpOnly,

      // Controls when cookies are sent with cross-site requests
      sameSite: getSameSite(),

      // Global path for all cookies
      path: '/',

      // Only sign cookies in production to avoid tampering
      signed: isProduction,

      // Optional domain restriction for cookies
      domain: process.env.COOKIE_DOMAIN,
    },
  };
});
