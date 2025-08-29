import { registerAs } from '@nestjs/config';
import { Params } from 'nestjs-pino';
import { IncomingMessage } from 'node:http';
import { join } from 'node:path';

export default registerAs('pinoConfig', (): Params => {
  const isProduction = process.env.NODE_ENV === 'production';
  const logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');
  const logDir = process.env.LOG_DIR || join(process.cwd(), 'logs');
  const logMaxSize = parseInt(process.env.LOG_MAX_SIZE || '10485760', 10);
  const logMaxFiles = parseInt(process.env.LOG_MAX_FILES || '7', 10);
  const logRotationFrequency = process.env.LOG_ROTATION_FREQUENCY || 'daily';

  return {
    pinoHttp: {
      level: logLevel,
      transport: {
        targets: [
          // pino-pretty solo en desarrollo
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
          // pino-roll para logs generales (siempre activo)
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
          // pino-roll para errores (siempre activo)
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
      customAttributeKeys: {
        req: 'request',
        res: 'response',
        err: 'error',
        responseTime: 'timeTaken',
      },
      timestamp: () => `,"time":"${new Date().toISOString()}"`,
      customProps: (req: IncomingMessage) => ({
        context: req.url || 'HTTP',
        correlationId: req.id || 'x-correlation-id-not-found',
      }),
      redact: {
        paths: [
          'request.headers.authorization',
          'request.headers.cookie',
          '*.cookie',
          'response.headers["set-cookie"]',
          '*.password',
          '*.passwordHash',
          'request.body.password',
          'request.body.passwordConfirmation',
          '*.pin',
          '*.accessToken',
        ],
        censor: '[REDACTED]',
      },
    },
  };
});
