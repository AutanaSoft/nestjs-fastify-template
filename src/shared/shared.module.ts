import { Module } from '@nestjs/common';
import { PrismaService } from './application/services';

@Module({
  imports: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class SharedModule {}
