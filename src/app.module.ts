import { AppResolver } from '@/app.resolver';
import { AppService } from '@/app.service';
import {
  appConfig,
  cookieConfig,
  corsConfig,
  databaseConfig,
  graphqlConfig,
  throttlerConfig,
} from '@config/index';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { GraphQLExceptionFilter } from '@shared/infrastructure/filters';
import { SharedModule } from '@shared/shared.module';
import { UserModule } from './modules/user/user.module';
import { PinoLoggerModule } from './pino-logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, cookieConfig, corsConfig, databaseConfig, throttlerConfig, graphqlConfig],
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<MercuriusDriverConfig>({
      inject: [ConfigService],
      driver: MercuriusDriver,
      useFactory: (configService: ConfigService) => {
        const graphqlConfig =
          configService.get<Omit<MercuriusDriverConfig, 'drive'>>('graphqlConfig')!;
        return graphqlConfig;
      },
    }),
    PinoLoggerModule,
    SharedModule,
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
})
export class AppModule {}
