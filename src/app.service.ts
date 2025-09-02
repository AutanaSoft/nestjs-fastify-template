import { AppConfig } from '@config/appConfig';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppInfoResponseDto, HealthCheckResponseDto } from '@shared/application/dto';
import { PrismaService } from './shared/application/services';

/**
 * Service responsible for handling application-level logic,
 * such as retrieving application information and health status.
 */
@Injectable()
export class AppService {
  private readonly appConfig: AppConfig;

  /**
   * Initializes the AppService with required dependencies.
   * @param configService - Service for accessing configuration.
   * @param prismaService - Service for database interactions.
   * @param correlationService - Service for managing correlation IDs.
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.appConfig = configService.get<AppConfig>('appConfig')!;
  }

  /**
   * Retrieves basic application information.
   * @returns An object containing the application name, version, message, and correlation ID.
   */
  getAppInfo(): AppInfoResponseDto {
    return {
      name: this.appConfig.name,
      version: this.appConfig.version,
      message: 'Welcome to NestJS Template API',
    };
  }

  /**
   * Performs a health check of the application and its database connection.
   * @returns A promise that resolves to an object with the application's health status.
   */
  async getHealth(): Promise<HealthCheckResponseDto> {
    const appInfo = this.getAppInfo();
    const dbHealth = await this.prismaService.healthCheck(); // Assuming this method returns the database health status
    return {
      status: 'ok',
      name: appInfo.name,
      version: appInfo.version,
      database: dbHealth,
      timestamp: new Date().toISOString(),
    };
  }
}
