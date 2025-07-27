import { registerAs } from '@nestjs/config';

export type DatabaseConfig = {
  url: string;
  provider: 'postgresql' | 'mysql' | 'sqlite';
  logging: boolean;
  ssl: boolean;
  connectionLimit: number;
  queryTimeout: number;
  enableReplicationRead: boolean;
  shadowDatabaseUrl?: string;
};

export default registerAs('databaseConfig', (): DatabaseConfig => {
  const provider = process.env.DATABASE_PROVIDER;
  const validProviders: DatabaseConfig['provider'][] = ['postgresql', 'mysql', 'sqlite'];
  const selectedProvider = validProviders.includes(provider as DatabaseConfig['provider'])
    ? (provider as DatabaseConfig['provider'])
    : 'postgresql';

  return {
    url: process.env.DATABASE_URL || 'mysql://nestjs:nestjs@mariadb:3306/nestjs_app',
    provider: selectedProvider,
    logging: process.env.DATABASE_LOGGING === 'true',
    ssl: process.env.DATABASE_SSL === 'true',
    connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT || '10', 10),
    queryTimeout: parseInt(process.env.DATABASE_QUERY_TIMEOUT || '5000', 10),
    enableReplicationRead: process.env.DATABASE_ENABLE_READ_REPLICAS === 'true',
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  };
});
