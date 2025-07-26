# Pino Logger Configuration

## Overview

The `pino-logger.module.ts` provides centralized logging configuration for the NestJS application using the `nestjs-pino` package with Pino logger. This configuration implements structured logging with multiple targets, log rotation, request correlation, and sensitive data redaction.

## Dependencies

- `nestjs-pino`: NestJS integration for Pino logger
- `pino-pretty`: Pretty printing for development
- `pino-roll`: File rotation transport
- `@nestjs/config`: Configuration management

## Features

- **Structured Logging**: JSON format for production, pretty format for development
- **File Rotation**: Automatic log file rotation by size and date
- **Correlation ID**: Request tracking across the application
- **Data Redaction**: Automatic removal of sensitive information
- **Multiple Targets**: Console and file outputs with different configurations

## Environment Variables

The logger configuration reads from the following environment variables:

| Environment Variable     | Default Value     | Type   | Description                                                        |
| ------------------------ | ----------------- | ------ | ------------------------------------------------------------------ |
| `LOG_LEVEL`              | `'info'`          | string | Logging level (`trace`, `debug`, `info`, `warn`, `error`, `fatal`) |
| `LOG_DIR`                | `'logs'`          | string | Directory for log files (relative to project root)                 |
| `LOG_MAX_SIZE`           | `10485760` (10MB) | number | Maximum file size before rotation                                  |
| `LOG_MAX_FILES`          | `7`               | number | Maximum number of rotated files to keep                            |
| `LOG_ROTATION_FREQUENCY` | `'daily'`         | string | Rotation frequency (`daily`, `hourly`, `weekly`)                   |

## Log Targets

### 1. Console Output (pino-pretty)

Development-friendly console output with:

- **Colorized output**: Different colors for log levels
- **Single line format**: Compact display
- **Timestamp format**: `dd/mm/yyyy - HH:MM:ss`
- **Custom message format**: `[{context}] {msg}`

### 2. Application Log File (pino-roll)

General application logs with:

- **File pattern**: `app.YYYY-MM-DD.log` (e.g., `app.2025-01-26.log`)
- **Automatic rotation**: By size and frequency using `dateFormat`
- **Directory creation**: Automatic log directory creation

### 3. Error Log File (pino-roll)

Dedicated error logging with:

- **File name**: `error.log`
- **Level filtering**: Only `error` level and above
- **Same rotation**: Follows general rotation settings

## Correlation ID System

The logger implements automatic correlation ID tracking:

### Sources (in priority order)

1. **HTTP Header**: `x-correlation-id` from request
2. **Request Property**: `correlationId` attached to request object
3. **Auto-generated**: Random UUID if none provided

### Usage Example

```typescript
// Setting correlation ID in a middleware
request.correlationId = 'custom-correlation-id';

// Or via HTTP header
curl -H "X-Correlation-Id: my-trace-id" http://localhost:3000/api
```

## Data Redaction

Automatic redaction of sensitive information:

### Redacted Paths

- `request.headers.authorization`
- `request.headers.cookie`
- `response.headers["set-cookie"]`
- `*.password`
- `*.passwordHash`
- `request.body.password`
- `request.body.passwordConfirmation`
- `*.pin`
- `*.accessToken`

### Redaction Example

```json
{
  "request": {
    "headers": {
      "authorization": "[REDACTED]"
    },
    "body": {
      "username": "john",
      "password": "[REDACTED]"
    }
  }
}
```

## Log File Structure

### Directory Layout

```
logs/
├── app.2025-01-26.log          # Today's application logs
├── app.2025-01-25.log          # Yesterday's logs
├── app.2025-01-24.log          # Day before logs
├── app-error.2025-01-26.log    # Today's error logs
├── app-error.2025-01-25.log    # Yesterday's error logs
└── app-error.2025-01-24.log    # Day before error logs
```

### Log Entry Format

```json
{
  "level": 30,
  "time": "2025-01-26T10:30:00.000Z",
  "pid": 12345,
  "hostname": "server01",
  "request": {
    "method": "GET",
    "url": "/api/users",
    "headers": {
      /* headers */
    }
  },
  "response": {
    "statusCode": 200,
    "headers": {
      /* headers */
    }
  },
  "timeTaken": 45,
  "context": "/api/users",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "msg": "Request completed"
}
```

## Usage

### Basic Integration

```typescript
import { Module } from '@nestjs/common';
import { PinoLoggerModule } from './shared/pino-logger.module';

@Module({
  imports: [PinoLoggerModule],
})
export class AppModule {}
```

### Using in Services

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  async findUser(id: string) {
    this.logger.log(`Finding user with ID: ${id}`);

    try {
      const user = await this.userRepository.findById(id);
      this.logger.log(`User found: ${user.email}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to find user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

### Using with Request Context

```typescript
import { Injectable } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@Injectable()
export class OrderService {
  constructor(
    @InjectPinoLogger(OrderService.name)
    private readonly logger: PinoLogger,
  ) {}

  async createOrder(orderData: any, req: any) {
    // Logger automatically includes correlation ID from request
    this.logger.info({ orderData }, 'Creating new order');

    // Correlation ID will be included in all log entries
    const order = await this.orderRepository.create(orderData);

    this.logger.info({ orderId: order.id }, 'Order created successfully');
    return order;
  }
}
```

## Environment-Specific Configuration

### Development Environment

```bash
# .env.development
LOG_LEVEL=debug
LOG_DIR=logs
LOG_MAX_SIZE=5242880          # 5MB (smaller files for development)
LOG_MAX_FILES=3               # Keep fewer files
LOG_ROTATION_FREQUENCY=daily
```

### Production Environment

```bash
# .env.production
LOG_LEVEL=info
LOG_DIR=/var/log/nestjs-app   # Absolute path for production
LOG_MAX_SIZE=52428800         # 50MB (larger files for production)
LOG_MAX_FILES=30              # Keep more history
LOG_ROTATION_FREQUENCY=daily
```

### Testing Environment

```bash
# .env.test
LOG_LEVEL=error               # Minimal logging during tests
LOG_DIR=test-logs
LOG_MAX_SIZE=1048576          # 1MB (small files for tests)
LOG_MAX_FILES=1               # Keep minimal files
LOG_ROTATION_FREQUENCY=daily
```

## Log Levels

### Available Levels

- **`trace`** (10): Very detailed debugging information
- **`debug`** (20): Debugging information
- **`info`** (30): General information (default)
- **`warn`** (40): Warning messages
- **`error`** (50): Error messages
- **`fatal`** (60): Critical errors

### Level Usage Examples

```typescript
this.logger.trace('Very detailed debug info');
this.logger.debug('Debug information');
this.logger.info('General information');
this.logger.warn('Warning message');
this.logger.error('Error occurred', error.stack);
this.logger.fatal('Critical system error');
```

## Log Rotation

### Rotation Triggers

1. **File Size**: When log file exceeds `LOG_MAX_SIZE`
2. **Time Frequency**: According to `LOG_ROTATION_FREQUENCY`

### Rotation Frequencies

- **`daily`**: Rotate every day at midnight
- **`hourly`**: Rotate every hour
- **`weekly`**: Rotate every week

### File Naming Patterns

- **Date-based**: `app.YYYY-MM-DD.log` and `app-error.YYYY-MM-DD.log`
- **Numbered**: `error.log`, `error.log.1`, `error.log.2`

## Monitoring and Observability

### Log Analysis

```bash
# Follow live logs
tail -f logs/app.$(date +%Y-%m-%d).log

# Search for specific correlation ID
grep "550e8400-e29b-41d4-a716-446655440000" logs/app*.log

# Filter by log level
grep '"level":50' logs/app*.log | jq .

# Find errors for specific endpoint
grep '"/api/orders"' logs/error.log
```

### Health Check Integration

```typescript
@Controller('health')
export class HealthController {
  constructor(private readonly logger: Logger) {}

  @Get('logs')
  getLogHealth() {
    const logDir = process.env.LOG_DIR || 'logs';
    const logFile = join(logDir, `app.${new Date().toISOString().split('T')[0]}.log`);

    try {
      const stats = fs.statSync(logFile);
      this.logger.log('Log health check performed');

      return {
        status: 'ok',
        logFile: logFile,
        size: stats.size,
        lastModified: stats.mtime,
      };
    } catch (error) {
      this.logger.error('Log health check failed', error.stack);
      return {
        status: 'error',
        error: 'Log file not accessible',
      };
    }
  }
}
```

## Best Practices

### Logging Guidelines

1. **Use appropriate log levels**: Don't log everything as `info`
2. **Include context**: Add relevant data to help with debugging
3. **Avoid logging sensitive data**: Use structured logging to exclude secrets
4. **Use correlation IDs**: Track requests across service boundaries
5. **Log errors with stack traces**: Include full error context

### Performance Considerations

1. **Async logging**: Pino is asynchronous by default for better performance
2. **Log rotation**: Prevents disk space issues
3. **Appropriate log levels**: Use `debug` for development, `info` for production
4. **Structured logging**: Easier to parse and analyze

### Security Considerations

1. **Data redaction**: Automatically removes sensitive information
2. **Log file permissions**: Ensure proper file system permissions
3. **Log retention**: Configure appropriate retention policies
4. **Access control**: Restrict access to log files

## Troubleshooting

### Common Issues

1. **Log files not created**
   - Check `LOG_DIR` permissions
   - Verify directory exists or can be created
   - Check disk space

2. **Rotation not working**
   - Verify `pino-roll` transport configuration
   - Check file permissions
   - Validate rotation frequency setting

3. **Missing correlation IDs**
   - Ensure correlation ID middleware is installed
   - Check header names match configuration
   - Verify middleware order

### Debug Configuration

```typescript
// Add to a debug controller
@Get('logger-config')
getLoggerConfig() {
  return {
    logLevel: process.env.LOG_LEVEL || 'info',
    logDir: process.env.LOG_DIR || 'logs',
    logMaxSize: process.env.LOG_MAX_SIZE || 10485760,
    logMaxFiles: process.env.LOG_MAX_FILES || 7,
    rotationFrequency: process.env.LOG_ROTATION_FREQUENCY || 'daily',
  };
}
```

## Related Files

- `src/shared/shared.module.ts` - Shared module registration
- `src/shared/infrastructure/interceptors/` - Request interceptors
- `src/main.ts` - Logger initialization
- `docs/APP_CONFIG.md` - Application configuration documentation

## Migration Notes

When updating logger configuration:

1. **Test log rotation** in development environment
2. **Monitor disk usage** after changing file sizes
3. **Update log parsing tools** if format changes
4. **Coordinate with monitoring systems** for log ingestion
5. **Review redaction rules** for new sensitive data fields
