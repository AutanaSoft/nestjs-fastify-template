import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig, cookieConfig, corsConfig, throttlerConfig } from './config';
import { SharedModule } from './shared';
import { HelloModule } from './modules/hello/hello.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, cookieConfig, corsConfig, throttlerConfig],
      envFilePath: ['.env', '.env.local'],
      isGlobal: true,
    }),
    SharedModule,
    HelloModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
