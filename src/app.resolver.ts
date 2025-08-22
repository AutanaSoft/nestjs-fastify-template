import { AppService } from '@/app.service';
import { Query, Resolver } from '@nestjs/graphql';
import { AppInfoResponseDto, HealthCheckResponseDto } from '@shared/application/dto';

/**
 * Main application controller for handling application-level requests.
 * Provides endpoints for application information and health checks.
 */
@Resolver()
export class AppResolver {
  /**
   * Initializes the AppController with the AppService.
   * @param appService - The application service for business logic.
   */
  constructor(private readonly appService: AppService) {}

  @Query(() => AppInfoResponseDto)
  getAppInfo(): AppInfoResponseDto {
    return this.appService.getAppInfo();
  }

  @Query(() => HealthCheckResponseDto)
  async getHealth(): Promise<HealthCheckResponseDto> {
    return this.appService.getHealth();
  }
}
