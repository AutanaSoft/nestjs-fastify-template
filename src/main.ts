import { AppModule } from '@/app.module';
import { AppConfig } from '@config/appConfig';
import fastifyCookie, { FastifyCookieOptions } from '@fastify/cookie';
import fastifyCors, { FastifyCorsOptions } from '@fastify/cors';
import helmet, { FastifyHelmetOptions } from '@fastify/helmet';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { X_CORRELATION_ID } from '@shared/domain/constants';
import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      // Generate a unique request ID
      genReqId: (req: IncomingMessage) => {
        const correlationId = req.headers[X_CORRELATION_ID];
        return Array.isArray(correlationId) ? correlationId[0] : correlationId || randomUUID();
      },
      // The header name to use for the request ID
      requestIdHeader: X_CORRELATION_ID,
      // The log label to use for the request ID
      requestIdLogLabel: 'correlationId',
    }),
    {
      bufferLogs: true,
    },
  );

  // Add correlation ID to response headers
  const fastify = app.getHttpAdapter().getInstance();
  fastify.addHook('onRequest', (request, reply, done) => {
    reply.header(X_CORRELATION_ID, request.id);
    done();
  });

  // load logger from the application
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // load configuration from config service
  const configService = app.get(ConfigService);
  const appConf = configService.get<AppConfig>('appConfig')!;
  const cookieConf = configService.get<FastifyCookieOptions>('cookieConfig')!;
  const corsConf = configService.get<FastifyCorsOptions>('corsConfig')!;
  const helmetConf = configService.get<FastifyHelmetOptions>('helmetConfig')!;

  // configure application settings
  // @ts-expect-error - Type incompatibility between Fastify plugin and NestJS adapter instance
  await app.register(fastifyCookie, cookieConf);
  // @ts-expect-error - Type incompatibility between Fastify plugin and NestJS adapter instance
  await app.register(fastifyCors, corsConf);
  // @ts-expect-error - Type incompatibility between Fastify plugin and NestJS adapter instance
  await app.register(helmet, helmetConf);
  app.useGlobalPipes(new ValidationPipe({}));

  // start the application
  await app.listen(appConf.port, '0.0.0.0');

  // log application startup details
  logger.log(`Running on: http://localhost:${appConf.port}/`);
  logger.log(`Environment: ${appConf.environment}`);
  logger.log(`Log Level: ${appConf.logLevel}`);
}

// start the application
bootstrap().catch(err => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
