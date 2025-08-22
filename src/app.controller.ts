import { AppService } from '@/app.service';
import { Controller } from '@nestjs/common';
import { AppInfoResponseDto, HealthCheckResponseDto } from '@shared/application/dto';
import { PrismaService } from '@shared/infrastructure/adapters';

/**
 * Main application controller for handling application-level requests.
 * Provides endpoints for application information and health checks.
 */
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

  getAppInfo(): AppInfoResponseDto {
    return this.appService.getAppInfo();
  }

  async getHealth(): Promise<HealthCheckResponseDto> {
    return this.appService.getHealth();
  }
}
