import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AppConfig } from './config/appConfig';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );

  // load logger from the application
  const logger = new Logger('Bootstrap');
  app.useLogger(logger);

  // load configuration from config service
  const configService = app.get(ConfigService);
  const config = configService.get<AppConfig>('appConfig')!;

  // configure application settings
  app.setGlobalPrefix(config.prefix);
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
