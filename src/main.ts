import { AppModule } from '@/app.module';
import { AppConfig } from '@config/appConfig';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';

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
  // const cookieConf = configService.get<FastifyCookieOptions>('cookieConfig')!;
  // const corsConf = configService.get<FastifyCorsOptions>('corsConfig')!;

  // configure application settings
  // await app.register(helmet);
  // await app.register(fastifyCors, corsConf);
  // await app.register(fastifyCookie, cookieConf);
  // await app.register(fastifyCsrf);
  app.useGlobalPipes(new ValidationPipe({}));

  // app.setGlobalPrefix(appConf.prefix);

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
