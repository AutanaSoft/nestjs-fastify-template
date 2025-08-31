/**
 * Database Configuration Module
 *
 * This module configures the database connection settings for the application with:
 * - Flexible database provider support (PostgreSQL, MySQL, SQLite)
 * - Connection management (timeouts, limits, SSL)
 * - Performance optimization options (read replicas)
 * - Query logging configuration
 * - Support for Prisma shadow database for migrations
 */

import { registerAs } from '@nestjs/config';

/**
 * Database configuration type definition
 * Defines the structure for all database-related configuration values
 */
export type DatabaseConfig = {
  /** Database connection string (DSN/URL format) */
  url: string;
  /** Database provider/engine type */
  provider: 'postgresql' | 'mysql' | 'sqlite';
  /** Whether SQL query logging is enabled */
  logging: boolean;
  /** Whether SSL/TLS is required for database connections */
  ssl: boolean;
  /** Maximum number of concurrent database connections */
  connectionLimit: number;
  /** Maximum time in milliseconds before a query times out */
  queryTimeout: number;
  /** Whether to enable read replicas for scaling read operations */
  enableReplicationRead: boolean;
  /** Optional shadow database URL for Prisma migrations */
  shadowDatabaseUrl?: string;
};

/**
 * Database configuration factory
 * Registers configuration using NestJS Config module with 'databaseConfig' namespace
 *
 * Environment variables:
 * - DATABASE_URL: Connection string in DSN format (default: development MySQL connection)
 * - DATABASE_PROVIDER: Database engine ('postgresql', 'mysql', 'sqlite') (default: 'postgresql')
 * - DATABASE_LOGGING: Enable SQL query logging ('true'/'false') (default: false)
 * - DATABASE_SSL: Require SSL/TLS for connections ('true'/'false') (default: false)
 * - DATABASE_CONNECTION_LIMIT: Max number of concurrent connections (default: 10)
 * - DATABASE_QUERY_TIMEOUT: Query timeout in milliseconds (default: 5000)
 * - DATABASE_ENABLE_READ_REPLICAS: Use read replicas if available ('true'/'false') (default: false)
 * - SHADOW_DATABASE_URL: URL for Prisma shadow database for migrations (optional)
 *
 * @returns The database configuration object
 */
export default registerAs('databaseConfig', (): DatabaseConfig => {
  // Validate and select the database provider
  const provider = process.env.DATABASE_PROVIDER;
  const validProviders: DatabaseConfig['provider'][] = ['postgresql', 'mysql', 'sqlite'];
  const selectedProvider = validProviders.includes(provider as DatabaseConfig['provider'])
    ? (provider as DatabaseConfig['provider'])
    : 'postgresql';

  return {
    // Database connection string with fallback for development
    url: process.env.DATABASE_URL || 'mysql://nestjs:nestjs@mariadb:3306/nestjs_app',

    // Selected and validated database provider
    provider: selectedProvider,

    // Whether to log SQL queries (useful for debugging, but impacts performance)
    logging: process.env.DATABASE_LOGGING === 'true',

    // Whether to require SSL/TLS for database connections (recommended for production)
    ssl: process.env.DATABASE_SSL === 'true',

    // Maximum number of concurrent database connections
    connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT || '10', 10),

    // Maximum time in milliseconds before a query times out
    queryTimeout: parseInt(process.env.DATABASE_QUERY_TIMEOUT || '5000', 10),

    // Whether to enable read replicas for scaling read operations
    enableReplicationRead: process.env.DATABASE_ENABLE_READ_REPLICAS === 'true',

    // Optional shadow database URL for Prisma migrations
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  };
});
