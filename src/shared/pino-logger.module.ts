import { Module } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { LoggerModule } from 'nestjs-pino';
import { IncomingMessage } from 'node:http';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: () => {
        return {
          pinoHttp: {
            level: 'debug',
            transport: {
              targets: [
                {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                    levelFirst: true,
                    //ignore: 'pid,hostname',
                    messageFormat: '[{context}] {msg}',
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
            customProps: (req: IncomingMessage) => {
              const headerValue = req.headers['x-correlation-id'];
              const correlationIdFromRequest = (
                req as unknown as FastifyRequest & { correlationId?: string }
              ).correlationId;
              const correlationId =
                (Array.isArray(headerValue) ? headerValue[0] : headerValue) ||
                correlationIdFromRequest ||
                crypto.randomUUID();

              return {
                context: req.url || 'http',
                correlationId,
              };
            },
          },
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class PinoLoggerModule {}
