import { Module } from '@nestjs/common';
import { CorrelationService, PrismaService } from './application/services';

@Module({
  imports: [],
  providers: [CorrelationService, PrismaService],
  exports: [CorrelationService, PrismaService],
})
export class SharedModule {}
