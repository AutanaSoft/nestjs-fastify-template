import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CorrelationService } from './application/services';
import { DatabaseModule } from './database.module';
import { GraphQConfigLModule } from './graphql.module';
import { CorrelationIdMiddleware } from './infrastructure/middleware';
import { PinoLoggerModule } from './pino-logger.module';

@Module({
  imports: [PinoLoggerModule, DatabaseModule, GraphQConfigLModule],
  providers: [CorrelationService],
  exports: [CorrelationService],
})
export class SharedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
