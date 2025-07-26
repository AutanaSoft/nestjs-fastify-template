import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerConfig } from '@config/throttlerConfig';
import { CorrelationIdInterceptor } from './infrastructure/interceptors';
import { PinoLoggerModule } from './pino-logger.module';

@Module({
  imports: [
    PinoLoggerModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<ThrottlerConfig>('throttlerConfig')!;
        return [
          {
            ttl: config.ttl,
            limit: config.limit,
            skipIf: config.skipIf,
          },
        ];
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CorrelationIdInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [],
})
export class SharedModule {}
