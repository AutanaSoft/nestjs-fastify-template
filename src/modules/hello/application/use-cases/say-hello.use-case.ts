import { Injectable } from '@nestjs/common';
import { HelloService } from '../../domain/services';
import { HelloResponseDto, SayHelloRequestDto } from '../dto';

@Injectable()
export class SayHelloUseCase {
  constructor(private readonly helloService: HelloService) {}

  execute(request: SayHelloRequestDto): HelloResponseDto {
    const message = this.helloService.sayHello(request.name);
    return new HelloResponseDto(message);
  }
}
