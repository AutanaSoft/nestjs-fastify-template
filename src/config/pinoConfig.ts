import { registerAs } from '@nestjs/config';
import { Params } from 'nestjs-pino';
import { IncomingMessage } from 'node:http';
import { join } from 'node:path';

/**
 * List of sensitive keys to redact from logs for GDPR/security compliance.
 * Any property whose key includes one of these strings (case-insensitive)
 * will be replaced with '[REDACTED]' in the log output.
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
 * Recursively redacts sensitive fields from a log object.
 *
 * - Replaces any property whose key includes a sensitive string with '[REDACTED]'.
 * - Handles nested objects and arrays.
 * - Prevents infinite recursion on circular references using a WeakSet.
 *
 * @param obj The log object to redact.
 * @param seen (internal) Tracks visited objects to avoid cycles.
 * @returns A new object with sensitive fields redacted.
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
 * Pino logger configuration for NestJS (Fastify) with GDPR-compliant redaction.
 *
 * - Uses pino-pretty in development for human-readable logs.
 * - Uses pino-roll for file-based log rotation (general and error logs).
 * - Applies custom attribute keys for request/response/error/time.
 * - Adds ISO timestamp to each log entry.
 * - Adds correlationId and context to each log entry.
 * - Applies a global formatter to redact sensitive fields from all logs.
 *
 * @see https://getpino.io/
 * @see https://github.com/pinojs/pino-pretty
 * @see https://github.com/arthurint/pino-roll
 */
export default registerAs('pinoConfig', (): Params => {
  const isProduction = process.env.NODE_ENV === 'production';
  const logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');
  const logDir = process.env.LOG_DIR || join(process.cwd(), 'logs');
  const logMaxSize = parseInt(process.env.LOG_MAX_SIZE || '10485760', 10);
  const logMaxFiles = parseInt(process.env.LOG_MAX_FILES || '7', 10);
  const logRotationFrequency = process.env.LOG_ROTATION_FREQUENCY || 'daily';

  return {
    pinoHttp: {
      /**
       * Log level (info in production, debug otherwise)
       */
      level: logLevel,
      /**
       * Log transport targets:
       * - pino-pretty (dev only)
       * - pino-roll (general and error logs)
       */
      transport: {
        targets: [
          // pino-pretty only in development
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
          // pino-roll for general logs (always enabled)
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
          // pino-roll for error logs (always enabled)
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
      /**
       * Custom attribute keys for log structure
       */
      customAttributeKeys: {
        req: 'request',
        res: 'response',
        err: 'error',
        responseTime: 'timeTaken',
      },
      /**
       * ISO timestamp for each log entry
       */
      timestamp: () => `,"time":"${new Date().toISOString()}",`,
      /**
       * Adds context and correlationId to each log entry
       */
      customProps: (req: IncomingMessage) => ({
        context: req.url || 'HTTP',
        correlationId: req.id || 'x-correlation-id-not-found',
      }),
      /**
       * Global log formatter: applies deep redaction to all log objects
       */
      formatters: {
        log: (logObj: Record<string, unknown>) => redactSensitiveLogObject(logObj),
      },
    },
  };
});
