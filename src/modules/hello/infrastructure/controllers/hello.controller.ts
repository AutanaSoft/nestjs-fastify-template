import { Controller, Get, Post, Body } from '@nestjs/common';
import { GetHelloUseCase, SayHelloUseCase } from '../../application/use-cases';
import { HelloResponseDto, SayHelloRequestDto } from '../../application/dto';

@Controller('hello')
export class HelloController {
  constructor(
    private readonly getHelloUseCase: GetHelloUseCase,
    private readonly sayHelloUseCase: SayHelloUseCase,
  ) {}

  @Get()
  hello(): HelloResponseDto {
    return this.getHelloUseCase.execute();
  }

  @Post('say')
  sayHello(@Body() request: SayHelloRequestDto): HelloResponseDto {
    return this.sayHelloUseCase.execute(request);
  }
}
