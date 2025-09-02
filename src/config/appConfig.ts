/**
 * Application Core Configuration Module
 *
 * This module provides the central configuration for the application including:
 * - Application metadata (name, description, version)
 * - Server settings (host, port, API prefix)
 * - Environment configuration
 * - Logging level
 */

import { registerAs } from '@nestjs/config';

/**
 * Application configuration type definition
 * Defines the structure for all application-level configuration values
 */
export type AppConfig = {
  /** Application name displayed in documentation and logs */
  name: string;
  /** Short description of the application's purpose */
  description: string;
  /** Semantic version number of the application */
  version: string;
  /** Hostname where the server will listen */
  host: string;
  /** Port number where the server will listen */
  port: number;
  /** API version prefix for all routes (e.g., 'v1') */
  prefix: string;
  /** Current application environment (development, production, test, etc.) */
  environment: string;
  /** Default logging level for the application */
  logLevel: string;
};

/**
 * Application configuration factory
 * Registers configuration using NestJS Config module with 'appConfig' namespace
 *
 * Environment variables:
 * - APP_NAME: Name of the application (default: 'NestTemplate')
 * - APP_DESCRIPTION: Description of the application (default: 'NestJS Template Application')
 * - APP_VERSION: Version number (default: '1.0.0')
 * - APP_HOST: Host to bind the server to (default: 'localhost')
 * - APP_PORT: Port to bind the server to (default: 4200)
 * - APP_ENV: Environment name (default: 'development')
 * - APP_PREFIX: API route prefix (default: 'v1')
 * - APP_LOG_LEVEL: Default logging level (default: 'debug')
 *
 * @returns The application configuration object
 */
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
