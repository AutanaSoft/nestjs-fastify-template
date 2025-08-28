import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { join } from 'node:path';

@Module({
  imports: [
    GraphQLModule.forRootAsync<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      useFactory: () => ({
        autoSchemaFile: join(process.cwd(), 'dist', 'schema.gql'),
        introspection: true,
        subscription: {
          fullWsTransport: true,
        },
      }),
    }),
  ],
})
export class GraphQConfigLModule {}
