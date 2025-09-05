import { AppResolver } from '@/app.resolver';
import { AppService } from '@/app.service';
import { GraphQLExceptionFilter } from '@/shared/application/filters';
import {
  appConfig,
  cookieConfig,
  corsConfig,
  databaseConfig,
  graphqlConfig,
  jwtConfig,
  pinoConfig,
  throttlerConfig,
} from '@config/index';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { SharedModule } from '@shared/shared.module';
import { LoggerModule, Params } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        appConfig,
        cookieConfig,
        corsConfig,
        databaseConfig,
        throttlerConfig,
        graphqlConfig,
        pinoConfig,
        jwtConfig,
      ],
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const pinoConfiguration = configService.get<Params>('pinoConfig');
        if (!pinoConfiguration) {
          throw new Error('Pino configuration not found');
        }
        return pinoConfiguration;
      },
    }),
    GraphQLModule.forRootAsync<MercuriusDriverConfig>({
      inject: [ConfigService],
      driver: MercuriusDriver,
      useFactory: (configService: ConfigService) => {
        const graphqlConfig =
          configService.get<Omit<MercuriusDriverConfig, 'drive'>>('graphqlConfig');
        if (!graphqlConfig) {
          throw new Error('GraphQL configuration not found');
        }
        return graphqlConfig;
      },
    }),
    SharedModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    AppService,
    AppResolver,
    {
      provide: APP_FILTER,
      useClass: GraphQLExceptionFilter,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
