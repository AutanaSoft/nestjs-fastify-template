import { createJwtModuleOptions, jwtConfig } from '@/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
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
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: createJwtModuleOptions,
      inject: [jwtConfig.KEY],
    }),
  ],
  providers: [PrismaService, PrismaErrorHandlerService, EventBusService, JwtTokenService],
  exports: [PrismaService, PrismaErrorHandlerService, EventBusService, JwtTokenService],
})
export class SharedModule {}
