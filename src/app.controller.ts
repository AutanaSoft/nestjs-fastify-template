import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AppConfig } from './config';

@ApiTags('app')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get application info' })
  @ApiResponse({ status: 200, description: 'Returns basic application information.' })
  getAppInfo(): { message: string; name: string; version: string } {
    return this.appService.getAppInfo();
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get application settings' })
  @ApiResponse({ status: 200, description: 'Returns application settings.' })
  @ApiResponse({ status: 404, description: 'Settings not found.' })
  getAppSettings(): AppConfig {
    return this.appService.getAppSettings();
  }
}
