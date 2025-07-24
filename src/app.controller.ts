import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { AppService } from './app.service';
import { AppConfig } from './config';

class SayHelloDto {
  @ApiProperty({
    description: 'Name of the user to greet',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;
}

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @ApiOperation({ summary: 'Get a hello message' })
  @ApiResponse({ status: 200, description: 'Returns a hello message.' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('appSettings')
  @ApiOperation({ summary: 'Get application settings' })
  @ApiResponse({ status: 200, description: 'Returns application settings.' })
  @ApiResponse({ status: 404, description: 'Settings not found.' })
  getAppSettings(): AppConfig {
    return this.appService.getAppSettings();
  }

  @Post('sayHello')
  @ApiOperation({ summary: 'Say hello to a user' })
  @ApiResponse({ status: 200, description: 'Returns a hello message.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: SayHelloDto })
  sayHello(@Body() body: SayHelloDto): string {
    console.log(`Saying hello to ${body.name}`);
    return this.appService.sayHello(body.name);
  }
}
