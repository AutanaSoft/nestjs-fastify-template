import { registerAs } from '@nestjs/config';

export type AppConfig = {
  port: number;
  environment: string;
  apiPrefix: string;
  logLevel: string;
};

export default registerAs(
  'appConfig',
  (): AppConfig => ({
    port: parseInt(process.env.PORT || '4200', 10),
    environment: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || 'v1',
    logLevel: process.env.LOG_LEVEL || 'info',
  }),
);
