import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventBusService, PrismaService } from './application/services';
import { JwtTokenService } from './application/services/jwt-token.service';
import { PrismaErrorHandlerService } from './application/services/prisma-error-handler.service';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      maxListeners: 20,
      verboseMemoryLeak: true,
    }),
  ],
  providers: [PrismaService, PrismaErrorHandlerService, EventBusService, JwtTokenService],
  exports: [PrismaService, PrismaErrorHandlerService, EventBusService, JwtTokenService],
})
export class SharedModule {}
