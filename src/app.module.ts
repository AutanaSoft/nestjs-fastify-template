import { AppResolver } from '@/app.resolver';
import { AppService } from '@/app.service';
import {
  appConfig,
  cookieConfig,
  corsConfig,
  databaseConfig,
  throttlerConfig,
} from '@config/index';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLExceptionFilter } from '@shared/infrastructure/filters';
import { SharedModule } from '@shared/shared.module';
import { GraphQConfigLModule } from './graphql.module';
import { UserModule } from './modules/user/user.module';
import { PinoLoggerModule } from './pino-logger.module';
import { CorrelationIdMiddleware } from './shared/infrastructure/middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, cookieConfig, corsConfig, databaseConfig, throttlerConfig],
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    PinoLoggerModule,
    GraphQConfigLModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
