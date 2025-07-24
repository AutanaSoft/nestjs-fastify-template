import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config';

@Injectable()
export class AppService {
  private readonly appConfig: AppConfig;
  constructor(private readonly configService: ConfigService) {
    this.appConfig = configService.get<AppConfig>('appConfig')!;
  }
  getHello(): string {
    return 'Hello World!';
  }

  getAppSettings(): AppConfig {
    return this.appConfig;
  }

  sayHello(name: string): string {
    return `Hello, ${name} from ${this.appConfig.name}!`;
  }
}
