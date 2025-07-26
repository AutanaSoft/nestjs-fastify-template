import { Module } from '@nestjs/common';
import { HelloController } from './infrastructure/controllers';
import { HelloService } from './domain/services';
import { GetHelloUseCase, SayHelloUseCase } from './application/use-cases';

@Module({
  controllers: [HelloController],
  providers: [HelloService, GetHelloUseCase, SayHelloUseCase],
})
export class HelloModule {}
