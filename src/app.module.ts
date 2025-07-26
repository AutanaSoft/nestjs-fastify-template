import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { appConfig, cookieConfig, corsConfig, throttlerConfig } from '@config/index';
import { SharedModule } from '@shared/shared.module';
import { HelloModule } from '@modules/hello/hello.module';

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
