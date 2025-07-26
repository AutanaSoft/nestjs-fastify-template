import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from '@/app.service';
import { AppConfig } from '@/config';

@ApiTags('Application')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Get application info',
    description:
      'Returns basic application information including name, version and welcome message',
  })
  @ApiResponse({
    status: 200,
    description: 'Application information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Welcome to NestJS Template API' },
        name: { type: 'string', example: 'nest-template' },
        version: { type: 'string', example: '1.0.0' },
      },
    },
  })
  getAppInfo(): { message: string; name: string; version: string } {
    return this.appService.getAppInfo();
  }

  @Get('settings')
  @ApiOperation({
    summary: 'Get application settings',
    description: 'Returns current application configuration settings',
  })
  @ApiResponse({
    status: 200,
    description: 'Application settings retrieved successfully',
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        port: { type: 'number', example: 4200 },
        prefix: { type: 'string', example: 'v1' },
        env: { type: 'string', example: 'development' },
        name: { type: 'string', example: 'nest-template' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Settings not found',
  })
  getAppSettings(): AppConfig {
    return this.appService.getAppSettings();
  }
}
