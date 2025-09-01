/**
 * GraphQL Configuration Module
 *
 * This module configures the Mercurius GraphQL server for NestJS with features like:
 * - Auto-generated schema file
 * - Production-safe introspection settings
 * - WebSocket subscription support
 * - Context injection for request/response access
 */

import { registerAs } from '@nestjs/config';
import { MercuriusDriverConfig } from '@nestjs/mercurius';
import { FastifyReply, FastifyRequest } from 'fastify';
import mqemitterRedis from 'mqemitter-redis';
import { join } from 'node:path';

/**
 * GraphQL configuration factory
 * Registers configuration using NestJS Config module with 'graphqlConfig' namespace
 *
 * Environment variables:
 * - NODE_ENV: Environment mode ('production', 'development', etc.)
 *
 * @returns Mercurius GraphQL configuration (without the driver property)
 */
export default registerAs('graphqlConfig', (): Omit<MercuriusDriverConfig, 'driver'> => {
  // Determine if we're in production mode
  const isProduction = process.env.NODE_ENV === 'production';
  const port = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;
  const host = process.env.REDIS_HOST || 'localhost';
  const password = process.env.REDIS_PASSWORD || 'redis';

  return {
    // Path where the auto-generated GraphQL schema will be saved
    autoSchemaFile: join(process.cwd(), 'dist', 'schema', 'graphql.gql'),

    // Disable introspection in production for security
    introspection: !isProduction,

    // Enable WebSocket subscriptions with full transport support
    subscription: {
      fullWsTransport: true,
      emitter: mqemitterRedis({
        port,
        host,
        password,
      }),
    },

    // Provide request/response objects to resolvers via GraphQL context
    context: (request: FastifyRequest, reply: FastifyReply) => ({
      res: reply,
      req: request,
    }),
  };
});
