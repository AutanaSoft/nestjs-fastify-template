import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { FastifyReply, FastifyRequest } from 'fastify';
import { join } from 'node:path';

@Module({
  imports: [
    GraphQLModule.forRootAsync<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      useFactory: () => ({
        autoSchemaFile: join(process.cwd(), 'dist', 'schema', 'graphql.gql'),
        introspection: true,
        subscription: {
          fullWsTransport: true,
        },
        context: (request: FastifyRequest, reply: FastifyReply) => ({
          res: reply,
          req: request,
        }),
      }),
    }),
  ],
})
export class GraphQLConfigModule {}
