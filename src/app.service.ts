import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@config/appConfig';

@Injectable()
export class AppService {
  private readonly appConfig: AppConfig;
  constructor(private readonly configService: ConfigService) {
    this.appConfig = configService.get<AppConfig>('appConfig')!;
  }

  getAppInfo(): { message: string; name: string; version: string } {
    return {
      message: 'Welcome to NestJS Template API',
      name: this.appConfig.name,
      version: this.appConfig.version,
    };
  }

  getAppSettings(): AppConfig {
    return this.appConfig;
  }
}
