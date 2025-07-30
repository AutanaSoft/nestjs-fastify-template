import { AppService } from '@/app.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppInfoResponseDto, HealthCheckResponseDto } from '@shared/application/dto';
import { PrismaService } from '@shared/infrastructure/adapters';

/**
 * Main application controller for handling application-level requests.
 * Provides endpoints for application information and health checks.
 */
@ApiTags('Application')
@Controller('app')
export class AppController {
  /**
   * Initializes the AppController with the AppService.
   * @param appService - The application service for business logic.
   * @param prismaService - The Prisma service for database interactions.
   */
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * Retrieves basic application information.
   * @returns An object containing application details.
   */
  @Get('info')
  @ApiOperation({
    summary: 'Get application info',
    description:
      'Returns basic application information including name, version and welcome message',
  })
  @ApiResponse({
    status: 200,
    description: 'Application information retrieved successfully',
    type: AppInfoResponseDto,
  })
  getAppInfo(): AppInfoResponseDto {
    return this.appService.getAppInfo();
  }

  /**
   * Provides an endpoint to check the health of the application.
   * @returns A promise that resolves to the application's health status.
   */
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    type: HealthCheckResponseDto,
  })
  async getHealth(): Promise<HealthCheckResponseDto> {
    return this.appService.getHealth();
  }
}
