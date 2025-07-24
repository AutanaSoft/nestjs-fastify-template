import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CorrelationIdInterceptor } from './infrastructure/interceptors';
import { PinoLoggerModule } from './pino-logger.module';

@Module({
  imports: [PinoLoggerModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CorrelationIdInterceptor,
    },
  ],
  exports: [],
})
export class SharedModule {}
