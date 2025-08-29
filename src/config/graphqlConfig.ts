import { registerAs } from '@nestjs/config';
import { MercuriusDriverConfig } from '@nestjs/mercurius';
import { FastifyReply, FastifyRequest } from 'fastify';
import { join } from 'node:path';

export default registerAs('graphqlConfig', (): Omit<MercuriusDriverConfig, 'driver'> => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    autoSchemaFile: join(process.cwd(), 'dist', 'schema', 'graphql.gql'),
    introspection: !isProduction,
    subscription: {
      fullWsTransport: true,
    },
    context: (request: FastifyRequest, reply: FastifyReply) => ({
      res: reply,
      req: request,
    }),
  };
});
