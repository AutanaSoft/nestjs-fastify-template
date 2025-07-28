import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import {
  appConfig,
  cookieConfig,
  corsConfig,
  databaseConfig,
  throttlerConfig,
} from '@config/index';
import { HelloModule } from '@modules/hello/hello.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, cookieConfig, corsConfig, databaseConfig, throttlerConfig],
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    SharedModule,
    HelloModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
