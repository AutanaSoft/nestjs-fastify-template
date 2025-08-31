/**
 * CORS Configuration Module
 *
 * This module configures Cross-Origin Resource Sharing (CORS) settings for the application with:
 * - Origin whitelisting with flexible configuration for development and production
 * - Customizable HTTP methods allowed for cross-origin requests
 * - Secure defaults for request headers and exposed response headers
 * - Support for credentials in cross-origin requests
 * - Proper handling of preflight requests
 */

import { FastifyCorsOptions } from '@fastify/cors';
import { registerAs } from '@nestjs/config';

/**
 * Parse and normalize the comma-separated list of allowed origins from environment variable
 * Empty or invalid entries are removed from the list
 */
const originWhitelist = (process.env.CORS_ORIGIN_WHITELIST ?? '')
  .split(',')
  .map(s => s.trim())
  .filter(s => s.length > 0);

/**
 * Default headers that are always allowed in cross-origin requests
 * Includes standard headers and special headers for tracing and monitoring
 */
const DEFAULT_ALLOWED_HEADERS = [
  'Content-Type', // For specifying the media type of the resource
  'Authorization', // For authentication credentials
  'Accept', // For content negotiation
  'Origin', // For indicating the origin of the request
  'X-Requested-With', // For identifying Ajax requests
  'X-Correlation-Id', // For request tracing across services
  'sentry-trace', // For Sentry performance monitoring
  'baggage', // For distributed tracing context propagation
] as const;

/**
 * Parse and normalize additional allowed headers from environment variable
 * These will be combined with the default headers
 */
const envAllowedHeaders = (process.env.CORS_ALLOWED_HEADERS ?? '')
  .split(',')
  .map(h => h.trim())
  .filter(h => h.length > 0);

/**
 * Final set of unique allowed headers, combining defaults with environment-provided ones
 * Using Set to ensure uniqueness and avoid duplicates
 */
const allowedHeaders = Array.from(
  new Set<string>([...DEFAULT_ALLOWED_HEADERS, ...envAllowedHeaders]),
);

/**
 * CORS configuration factory
 * Registers configuration using NestJS Config module with 'corsConfig' namespace
 *
 * Environment variables:
 * - NODE_ENV: Environment mode ('production', 'development', etc.)
 * - CORS_ORIGIN_WHITELIST: Comma-separated list of allowed origins
 * - CORS_METHODS: Comma-separated list of allowed HTTP methods
 * - CORS_ALLOWED_HEADERS: Additional allowed headers to merge with defaults
 * - CORS_EXPOSED_HEADERS: Headers that browsers are allowed to access
 *
 * @returns Configuration options for @fastify/cors plugin
 */
export default registerAs(
  'corsConfig',
  (): FastifyCorsOptions => ({
    // Dynamic origin validation based on whitelist
    origin: (origin, callback) => {
      // In non-production, allow any origin if whitelist is empty
      if (process.env.NODE_ENV !== 'production' && originWhitelist.length === 0) {
        return callback(null, true);
      }

      // Allow requests with no origin (like mobile apps or curl requests)
      // or requests from origins in the whitelist
      if (!origin || originWhitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Reject requests from non-whitelisted origins
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    // HTTP methods allowed for cross-origin requests
    methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    // Don't pass the preflight response to the route handlers
    preflightContinue: false,
    // Status code to use for successful OPTIONS requests
    optionsSuccessStatus: 204,
    // Allow credentials (cookies, authorization headers) to be sent cross-origin
    credentials: true, // Required for origin whitelisting to work correctly
    // Headers that are allowed in cross-origin requests
    allowedHeaders,
    // Headers that browsers are allowed to access
    exposedHeaders: process.env.CORS_EXPOSED_HEADERS || 'X-Total-Count,X-Correlation-Id',
  }),
);
