import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { IncomingMessage } from 'node:http';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './config';
import { CorrelationIdInterceptor } from './interceptors';
import { FastifyRequest } from 'fastify';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      envFilePath: ['.env', '.env.local'],
      isGlobal: true,
    }),
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
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CorrelationIdInterceptor,
    },
  ],
})
export class AppModule {}
