import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HelloResponseDto, SayHelloRequestDto } from '../../application/dto';
import { GetHelloUseCase, SayHelloUseCase } from '../../application/use-cases';

@ApiTags('Hello')
@Controller('hello')
export class HelloController {
  constructor(
    private readonly getHelloUseCase: GetHelloUseCase,
    private readonly sayHelloUseCase: SayHelloUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get hello message',
    description: 'Returns a simple hello world message',
  })
  @ApiResponse({
    status: 200,
    description: 'Hello message returned successfully',
    type: HelloResponseDto,
  })
  hello(): HelloResponseDto {
    return this.getHelloUseCase.execute();
  }

  @Post('say')
  @ApiOperation({
    summary: 'Say hello to someone',
    description: 'Returns a personalized hello message with the provided name',
  })
  @ApiBody({
    description: 'Request body containing the name to greet',
    type: SayHelloRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Personalized hello message returned successfully',
    type: HelloResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  sayHello(@Body() request: SayHelloRequestDto): HelloResponseDto {
    return this.sayHelloUseCase.execute(request);
  }
}
