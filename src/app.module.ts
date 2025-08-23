import { AppResolver } from '@/app.resolver';
import { AppService } from '@/app.service';
import {
  appConfig,
  cookieConfig,
  corsConfig,
  databaseConfig,
  throttlerConfig,
} from '@config/index';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@shared/shared.module';
import { GraphQConfigLModule } from './graphql.module';
import { UserModule } from './modules/user/user.module';
import { PinoLoggerModule } from './pino-logger.module';

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
  providers: [AppService, AppResolver],
})
export class AppModule {}
