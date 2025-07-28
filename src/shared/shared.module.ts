import { ThrottlerConfig } from '@config/throttlerConfig';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CorrelationService } from './application/services';
import { DatabaseModule } from './infrastructure/adapters';
import { CorrelationIdMiddleware } from './infrastructure/middleware';
import { PinoLoggerModule } from './pino-logger.module';

@Module({
  imports: [
    PinoLoggerModule,
    DatabaseModule,
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
    CorrelationService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [CorrelationService],
})
export class SharedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
