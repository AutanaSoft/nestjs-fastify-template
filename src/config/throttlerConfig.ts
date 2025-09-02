/**
 * Rate Limiting Configuration Module
 *
 * This module configures the throttling (rate limiting) settings for the application to:
 * - Protect against brute force attacks
 * - Prevent API abuse and DoS attacks
 * - Manage resource consumption
 * - Ensure fair usage of the API
 * - Disable throttling in test environments for simpler testing
 */

import { registerAs } from '@nestjs/config';

/**
 * Throttler configuration type definition
 * Defines the structure for all rate limiting configuration values
 */
export type ThrottlerConfig = {
  /** Time-to-live in milliseconds for the rate limit window */
  ttl: number;
  /** Maximum number of requests allowed within the TTL window */
  limit: number;
  /** Optional function to conditionally skip throttling for certain requests */
  skipIf?: (context: any) => boolean;
};

/**
 * Throttler configuration factory
 * Registers configuration using NestJS Config module with 'throttlerConfig' namespace
 *
 * Environment variables:
 * - THROTTLER_TTL: Duration of the rate limit window in milliseconds (default: 60000)
 * - THROTTLER_LIMIT: Maximum number of requests allowed in the window (default: 100)
 * - NODE_ENV: Used to disable throttling in test environments
 *
 * @returns Configuration options for @nestjs/throttler
 */
export default registerAs(
  'throttlerConfig',
  (): ThrottlerConfig => ({
    // Duration of the rate limit window in milliseconds (60 seconds by default)
    ttl: parseInt(process.env.THROTTLER_TTL || '60000', 10),

    // Maximum number of requests allowed within the TTL window
    limit: parseInt(process.env.THROTTLER_LIMIT || '100', 10),

    // Skip throttling completely in test environment for simpler testing
    skipIf: process.env.NODE_ENV === 'test' ? () => true : undefined,
  }),
);
