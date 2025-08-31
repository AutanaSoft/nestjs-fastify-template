/**
 * Helmet Security Configuration Module
 *
 * This module configures HTTP security headers via @fastify/helmet to:
 * - Protect against common web vulnerabilities
 * - Define Content Security Policy (CSP) directives
 * - Control which resources can be loaded and from where
 * - Enable secure integrations with third-party services
 * - Implement defense-in-depth security for the application
 */

import { FastifyHelmetOptions } from '@fastify/helmet';
import { registerAs } from '@nestjs/config';

/**
 * Helmet security configuration factory
 * Registers configuration using NestJS Config module with 'helmetConfig' namespace
 *
 * @returns Configuration options for @fastify/helmet plugin
 */
export default registerAs(
  'helmetConfig',
  (): FastifyHelmetOptions => ({
    // Content Security Policy configuration - restricts which resources can be loaded
    contentSecurityPolicy: {
      directives: {
        // By default, only allow resources from same origin
        defaultSrc: ["'self'"],

        // Allow scripts from specified sources and with specific permissions
        scriptSrc: [
          "'self'", // Same origin scripts
          "'unsafe-inline'", // Inline scripts (should be limited in production)
          "'unsafe-eval'", // Dynamic code evaluation (avoid in production if possible)
          'app.satismeter.com', // SatisMeter service
          'satismeter.com', // SatisMeter domain
          'cdn.launchdarkly.com', // LaunchDarkly feature flag service
        ],

        // Script element sources (for <script> tags)
        scriptSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'app.satismeter.com',
          'satismeter.com',
          'cdn.launchdarkly.com',
        ],

        // Connection sources for fetch, XHR, WebSockets, etc.
        connectSrc: [
          "'self'", // Same origin connections
          'https://events.launchdarkly.com', // LaunchDarkly events
          'https://clientstream.launchdarkly.com', // LaunchDarkly streaming
          'https://app.launchdarkly.com', // LaunchDarkly application
          'https://cdn.launchdarkly.com', // LaunchDarkly CDN
        ],
        // ...otras directivas existentes...
      },
    },
    // ...cualquier otra configuración existente...
  }),
);
