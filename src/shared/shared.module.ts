import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventBusService, PrismaService } from './application/services';
import { PrismaErrorHandlerService } from './infrastructure/services';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      // Enable wildcard event matching
      wildcard: true,
      // Limit maximum event listeners (0 = unlimited)
      maxListeners: 20,
      // Enable verbosity for debugging
      verboseMemoryLeak: true,
    }),
  ],
  providers: [PrismaService, PrismaErrorHandlerService, EventBusService],
  exports: [PrismaService, PrismaErrorHandlerService, EventBusService],
})
export class SharedModule {}
