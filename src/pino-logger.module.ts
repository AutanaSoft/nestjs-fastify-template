import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FastifyReply } from 'fastify';
import { LoggerModule } from 'nestjs-pino';
import { IncomingMessage, ServerResponse } from 'node:http';
import { join } from 'node:path';
import { X_CORRELATION_ID } from './shared/infrastructure/middleware';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule, SharedModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const logLevel = config.get<string>('LOG_LEVEL', 'info');
        const logDir = config.get<string>('LOG_DIR', join(process.cwd(), 'logs'));
        const logMaxSize = config.get<number>('LOG_MAX_SIZE', 10485760);
        const logMaxFiles = config.get<number>('LOG_MAX_FILES', 7);
        const logRotationFrequency = config.get<string>('LOG_ROTATION_FREQUENCY', 'daily');

        return {
          pinoHttp: {
            level: logLevel,
            transport: {
              targets: [
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
            genReqId: () => {
              return Math.random().toString(36).substring(2);
            },
            customProps: (req: IncomingMessage, res: ServerResponse) => {
              const response = res as unknown as FastifyReply;
              const correlationId =
                response.getHeader(X_CORRELATION_ID) ||
                response.request?.headers[X_CORRELATION_ID]?.toString() ||
                response.request?.headers[X_CORRELATION_ID.toUpperCase()]?.toString() ||
                'no-correlation-id-found';
              return {
                context: req.url || 'HTTP',
                correlationId,
              };
            },
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
      },
    }),
  ],
})
export class PinoLoggerModule {}
