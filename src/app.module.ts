import { AppResolver } from '@/app.resolver';
import { AppService } from '@/app.service';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import {
  appConfig,
  cookieConfig,
  corsConfig,
  databaseConfig,
  throttlerConfig,
} from '@config/index';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { SharedModule } from '@shared/shared.module';
import { join } from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, cookieConfig, corsConfig, databaseConfig, throttlerConfig],
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    SharedModule,
    // UserModule,
  ],
  controllers: [],
  providers: [AppService, AppResolver],
})
export class AppModule {}
