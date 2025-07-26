# Application Configuration

## Overview

The `appConfig.ts` module provides centralized configuration management for the NestJS application using the `@nestjs/config` package. This configuration follows the typed configuration pattern recommended for this template.

## Configuration Type

```typescript
export type AppConfig = {
  name: string; // Application name
  description: string; // Application description
  version: string; // Application version
  host: string; // Server host
  port: number; // Server port
  prefix: string; // API route prefix
  environment: string; // Runtime environment
  logLevel: string; // Logging level
};
```

## Environment Variables

The configuration reads from the following environment variables with their respective defaults:

| Environment Variable | Default Value                   | Type   | Description                                                 |
| -------------------- | ------------------------------- | ------ | ----------------------------------------------------------- |
| `APP_NAME`           | `'NestTemplate'`                | string | Application name displayed in logs and responses            |
| `APP_DESCRIPTION`    | `'NestJS Template Application'` | string | Brief description of the application                        |
| `APP_VERSION`        | `'1.0.0'`                       | string | Application version (semantic versioning)                   |
| `APP_HOST`           | `'localhost'`                   | string | Server host address                                         |
| `APP_PORT`           | `4200`                          | number | Server port number                                          |
| `APP_PREFIX`         | `'v1'`                          | string | Global API route prefix (e.g., `/v1/users`)                 |
| `APP_ENV`            | `'development'`                 | string | Runtime environment (`development`, `production`, `test`)   |
| `APP_LOG_LEVEL`      | `'debug'`                       | string | Logging level (`error`, `warn`, `info`, `debug`, `verbose`) |

## Usage

### Importing the Configuration

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config';

@Injectable()
export class MyService {
  constructor(private configService: ConfigService) {}

  getAppInfo() {
    const appConfig = this.configService.get<AppConfig>('appConfig');
    return {
      name: appConfig.name,
      version: appConfig.version,
      environment: appConfig.environment,
    };
  }
}
```

### Accessing Individual Properties

```typescript
// Get specific configuration values
const port = this.configService.get<number>('appConfig.port');
const apiPrefix = this.configService.get<string>('appConfig.prefix');
const environment = this.configService.get<string>('appConfig.environment');
```

## Configuration Registration

The configuration is registered in the `AppModule` using:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig], // Register the configuration
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

## Environment-Specific Configuration

### Development Environment

```bash
# .env.development
APP_NAME=NestTemplate
APP_PORT=4200
APP_ENV=development
APP_LOG_LEVEL=debug
APP_PREFIX=v1
```

### Production Environment

```bash
# .env.production
APP_NAME=MyProductionApp
APP_PORT=3000
APP_ENV=production
APP_LOG_LEVEL=info
APP_PREFIX=api/v1
APP_HOST=0.0.0.0
```

### Testing Environment

```bash
# .env.test
APP_NAME=NestTemplate-Test
APP_PORT=4201
APP_ENV=test
APP_LOG_LEVEL=error
APP_PREFIX=test/v1
```

## Validation

To add validation to the configuration, you can extend it with class-validator:

```typescript
import { IsString, IsNumber, IsIn } from 'class-validator';

export class AppConfigDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  version: string;

  @IsString()
  host: string;

  @IsNumber()
  port: number;

  @IsString()
  prefix: string;

  @IsIn(['development', 'production', 'test'])
  environment: string;

  @IsIn(['error', 'warn', 'info', 'debug', 'verbose'])
  logLevel: string;
}
```

## Best Practices

1. **Type Safety**: Always use the typed `AppConfig` interface when accessing configuration values
2. **Environment Variables**: Use descriptive names with consistent prefixes (`APP_`)
3. **Default Values**: Always provide sensible defaults for development
4. **Validation**: Consider adding validation for critical configuration values
5. **Documentation**: Keep this documentation updated when adding new configuration properties

## Related Files

- `src/config/index.ts` - Barrel export for all configuration modules
- `src/main.ts` - Application bootstrap using configuration
- `src/app.module.ts` - Configuration module registration

## Migration Notes

When adding new configuration properties:

1. Add the property to the `AppConfig` type
2. Add the environment variable mapping with a default value
3. Update this documentation
4. Update any related validation schemas
5. Update environment example files
