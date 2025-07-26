import fastifyCookie, { FastifyCookieOptions } from '@fastify/cookie';
import fastifyCors, { FastifyCorsOptions } from '@fastify/cors';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { AppConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  });

  // load logger from the application
  const logger = app.get(Logger);
  app.useLogger(logger);

  // load configuration from config service
  const configService = app.get(ConfigService);
  const appConf = configService.get<AppConfig>('appConfig')!;
  const cookieConf = configService.get<FastifyCookieOptions>('cookieConfig')!;
  const corsConf = configService.get<FastifyCorsOptions>('corsConfig')!;

  // configure application settings
  await app.register(helmet);
  await app.register(fastifyCors, corsConf);
  await app.register(fastifyCookie, cookieConf);
  await app.register(fastifyCsrf);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.setGlobalPrefix(appConf.prefix);

  // enable swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(appConf.name)
    .setDescription(`API documentation for ${appConf.name}`)
    .setVersion(appConf.version)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('v1/docs', app, document);

  await app.listen(appConf.port, '0.0.0.0');

  // log application startup details
  logger.log(`Running on: http://localhost:${appConf.port}/${appConf.prefix}`);
  logger.log(`Environment: ${appConf.environment}`);
  logger.log(`Log Level: ${appConf.logLevel}`);
}

// start the application
bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
