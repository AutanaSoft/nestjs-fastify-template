/**
 * Pino Logger Configuration Module
 *
 * This module configures the Pino logger for NestJS with features like:
 * - Log rotation with pino-roll
 * - Different transports for development and production
 * - Automatic redaction of sensitive information
 * - Custom formatting and structured logging
 * - Correlation IDs for request tracking
 */

import { registerAs } from '@nestjs/config';
import { Params } from 'nestjs-pino';
import { IncomingMessage } from 'node:http';
import { join } from 'node:path';
import { stdSerializers } from 'pino-http';

/**
 * List of sensitive keys that will be automatically redacted from logs
 * All keys containing these strings (case-insensitive) will have their values replaced with '[REDACTED]'
 */
const SENSITIVE_KEYS: readonly string[] = [
  'password',
  'currentPassword',
  'newPassword',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'apiKey',
  // Add more as needed
];

/**
 * Recursively redacts sensitive information from log objects
 *
 * @param obj - The object to redact sensitive information from
 * @param seen - WeakSet used to prevent circular reference loops
 * @returns A new object with sensitive information redacted
 */
function redactSensitiveLogObject(
  obj: Record<string, unknown>,
  seen = new WeakSet<object>(),
): Record<string, unknown> {
  if (seen.has(obj)) {
    return {}; // Prevent circular reference infinite loop
  }
  seen.add(obj);
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.some(sensitive => k.toLowerCase().includes(sensitive.toLowerCase()))) {
      result[k] = '[REDACTED]';
    } else if (Array.isArray(v)) {
      result[k] = (v as unknown[]).map(item =>
        typeof item === 'object' && item !== null
          ? redactSensitiveLogObject(item as Record<string, unknown>, seen)
          : item,
      );
    } else if (typeof v === 'object' && v !== null) {
      result[k] = redactSensitiveLogObject(v as Record<string, unknown>, seen);
    } else {
      result[k] = v;
    }
  }
  seen.delete(obj);
  return result;
}

/**
 * Pino configuration factory
 * Registers configuration using NestJS Config module with 'pinoConfig' namespace
 *
 * Environment variables:
 * - NODE_ENV: Environment mode ('production', 'development', etc.)
 * - LOG_LEVEL: Minimum log level to output (default: 'debug' in dev, 'info' in prod)
 * - LOG_DIR: Directory to store log files (default: './logs')
 * - LOG_MAX_SIZE: Maximum size of log files in bytes (default: 10MB)
 * - LOG_MAX_FILES: Maximum number of log files to keep (default: 7)
 * - LOG_ROTATION_FREQUENCY: How often to rotate logs (default: 'daily')
 *
 * @returns Pino logger configuration for nestjs-pino
 */
export default registerAs('pinoConfig', (): Params => {
  // Extract environment variables with sensible defaults
  const isProduction = process.env.NODE_ENV === 'production';
  const logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');
  const logDir = process.env.LOG_DIR || join(process.cwd(), 'logs');
  const logMaxSize = parseInt(process.env.LOG_MAX_SIZE || '10485760', 10); // 10MB default
  const logMaxFiles = parseInt(process.env.LOG_MAX_FILES || '7', 10);
  const logRotationFrequency = process.env.LOG_ROTATION_FREQUENCY || 'daily';

  return {
    pinoHttp: {
      level: logLevel,
      transport: {
        targets: [
          // Pretty-printed console logs only in development mode
          ...(isProduction
            ? []
            : [
                {
                  target: 'pino-pretty',
                  level: logLevel,
                  options: {
                    colorize: true,
                    singleLine: true,
                    levelFirst: false,
                    translateTime: 'SYS:HH:MM:ss',
                    ignore: 'hostname,pid',
                    messageFormat: '[{context}] {msg}',
                  },
                },
              ]),
          // File-based logging with rotation for general logs (always active)
          {
            target: 'pino-roll',
            level: logLevel,
            options: {
              file: join(logDir, 'app'),
              mkdir: true,
              size: logMaxSize,
              maxFiles: logMaxFiles,
              sync: false,
              frequency: logRotationFrequency,
              dateFormat: 'yyyy-MM-dd',
              extension: '.log',
            },
          },
          // Separate file for error logs to make troubleshooting easier (always active)
          {
            target: 'pino-roll',
            level: 'error',
            options: {
              file: join(logDir, 'app-error'),
              mkdir: true,
              size: logMaxSize,
              maxFiles: logMaxFiles,
              sync: false,
              frequency: logRotationFrequency,
              dateFormat: 'yyyy-MM-dd',
              extension: '.log',
            },
          },
        ],
      },
      // Customize key names in the log output
      customAttributeKeys: {
        req: 'request',
        res: 'response',
        err: 'error',
        responseTime: 'timeTaken',
      },
      // Ensure consistent timestamp format in ISO format
      timestamp: () => `,"time":"${new Date().toISOString()}"`,
      // Add custom properties to each log entry for better context and traceability
      customProps: (req: IncomingMessage) => ({
        context: req.url || 'HTTP',
        correlationId: req.id || 'x-correlation-id-not-found',
      }),
      // Apply sensitive data redaction to all log objects
      formatters: {
        log: (logObj: Record<string, unknown>) => redactSensitiveLogObject(logObj),
      },
      serializers: {
        err: stdSerializers.err,
        req: stdSerializers.req,
        res: stdSerializers.res,
      },
    },
  };
});
