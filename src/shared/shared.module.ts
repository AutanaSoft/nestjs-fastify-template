import { Module } from '@nestjs/common';
import { PrismaService } from './application/services';
import { PrismaErrorHandlerService } from './infrastructure/services';

@Module({
  imports: [],
  providers: [PrismaService, PrismaErrorHandlerService],
  exports: [PrismaService, PrismaErrorHandlerService],
})
export class SharedModule {}
