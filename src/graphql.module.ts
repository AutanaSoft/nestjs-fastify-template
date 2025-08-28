import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { join } from 'node:path';
@Module({
  imports: [
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      path: '/graphql',
      autoSchemaFile: join(process.cwd(), 'dist', 'schema.gql'),
      graphiql: true,
      subscription: true,
      introspection: true,
    }),
  ],
})
export class GraphQConfigLModule {}
