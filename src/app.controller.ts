import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from '@/app.service';
import { AppConfig } from '@config/appConfig';
import { PrismaService } from '@shared/infrastructure/adapters';
import { CorrelationService } from './shared/application/services';

@ApiTags('Application')
@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly correlationService: CorrelationService,
  ) {}

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

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Application is healthy' })
  async getHealth() {
    const dbHealth = await this.prismaService.healthCheck();
    const correlationId = this.correlationService.get();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      ...this.appService.getAppInfo(),
      correlationId,
    };
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get application settings' })
  @ApiResponse({ status: 200, description: 'Application settings' })
  getSettings() {
    const appConfig = this.configService.get<AppConfig>('appConfig')!;
    return {
      name: appConfig.name,
      version: appConfig.version,
      environment: appConfig.environment,
    };
  }
}
