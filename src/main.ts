import fastifyCors from '@fastify/cors';
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
  const config = configService.get<AppConfig>('appConfig')!;

  // configure application settings
  await app.register(helmet);
  await app.register(fastifyCors, {});
  await app.register(fastifyCsrf);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.setGlobalPrefix(config.prefix);

  // enable swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(config.name)
    .setDescription(`API documentation for ${config.name}`)
    .setVersion(config.version)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('v1/docs', app, document);

  await app.listen(config.port, '0.0.0.0');

  // log application startup details
  logger.log(`Running on: http://localhost:${config.port}/${config.prefix}`);
  logger.log(`Environment: ${config.environment}`);
  logger.log(`Log Level: ${config.logLevel}`);
}

// start the application
bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
