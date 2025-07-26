import { Injectable } from '@nestjs/common';
import { HelloService } from '../../domain/services';
import { HelloResponseDto } from '../dto';

@Injectable()
export class GetHelloUseCase {
  constructor(private readonly helloService: HelloService) {}

  execute(): HelloResponseDto {
    const message = this.helloService.getHelloMessage();
    return new HelloResponseDto(message);
  }
}
