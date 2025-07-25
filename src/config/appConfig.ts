import { registerAs } from '@nestjs/config';

export type AppConfig = {
  name: string;
  description: string;
  version: string;
  host: string;
  port: number;
  prefix: string;
  environment: string;
  logLevel: string;
};

export default registerAs(
  'appConfig',
  (): AppConfig => ({
    name: process.env.APP_NAME || 'NestTemplate',
    description: process.env.APP_DESCRIPTION || 'NestJS Template Application',
    version: process.env.APP_VERSION || '1.0.0',
    host: process.env.APP_HOST || 'localhost',
    port: parseInt(process.env.APP_PORT || '4200', 10),
    environment: process.env.APP_ENV || 'development',
    prefix: process.env.APP_PREFIX || 'v1',
    logLevel: process.env.APP_LOG_LEVEL || 'debug',
  }),
);
