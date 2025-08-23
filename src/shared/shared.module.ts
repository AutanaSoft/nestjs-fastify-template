import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CorrelationService, PrismaService } from './application/services';
import { CorrelationIdMiddleware } from './infrastructure/middleware';

@Module({
  imports: [],
  providers: [CorrelationService, PrismaService],
  exports: [CorrelationService, PrismaService],
})
export class SharedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
