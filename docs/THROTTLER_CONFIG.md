# Throttler Configuration

## Overview

The `throttlerConfig.ts` module provides centralized rate limiting configuration for the NestJS application using the `@nestjs/throttler` package. This configuration implements intelligent request throttling with environment-specific behavior, automatically disabling throttling in test environments while providing robust protection in development and production.

## Dependencies

- `@nestjs/throttler`: NestJS package for rate limiting
- `@nestjs/config`: NestJS configuration management

## Configuration Type

```typescript
export type ThrottlerConfig = {
  ttl: number; // Time to live in milliseconds
  limit: number; // Max requests per TTL period
  skipIf?: (context: any) => boolean; // Optional skip condition function
};
```

### Configuration Properties

| Property | Type       | Description                                              |
| -------- | ---------- | -------------------------------------------------------- |
| `ttl`    | `number`   | Time window in milliseconds for rate limiting            |
| `limit`  | `number`   | Maximum number of requests allowed within the TTL window |
| `skipIf` | `function` | Optional function to conditionally skip throttling       |

## Environment Variables

The configuration reads from the following environment variables:

| Environment Variable | Default Value        | Type   | Description                         |
| -------------------- | -------------------- | ------ | ----------------------------------- |
| `THROTTLER_TTL`      | `60000` (60 seconds) | number | Time window in milliseconds         |
| `THROTTLER_LIMIT`    | `100`                | number | Maximum requests per time window    |
| `NODE_ENV`           | `undefined`          | string | Environment mode for test detection |

## Environment-Specific Behavior

### Test Environment

- **Throttling**: Completely disabled (`skipIf: () => true`)
- **Purpose**: Ensures tests run without rate limiting interference
- **Condition**: `NODE_ENV === 'test'`

### Development/Production Environment

- **Throttling**: Fully enabled with configured limits
- **Purpose**: Protects API from abuse and excessive requests

## Default Rate Limiting

The default configuration provides:

- **Time Window**: 60 seconds (60,000 milliseconds)
- **Request Limit**: 100 requests per time window
- **Rate**: ~1.67 requests per second sustained

## Usage

### Basic Integration

```typescript
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { throttlerConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [throttlerConfig],
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('throttlerConfig'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### Accessing Throttler Configuration

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerConfig } from '../config/throttlerConfig';

@Injectable()
export class ThrottlerService {
  constructor(private configService: ConfigService) {}

  getThrottlerConfig(): ThrottlerConfig {
    return this.configService.get<ThrottlerConfig>('throttlerConfig');
  }

  getCurrentLimits() {
    const config = this.getThrottlerConfig();
    return {
      requestsPerWindow: config.limit,
      windowSizeMs: config.ttl,
      requestsPerSecond: config.limit / (config.ttl / 1000),
    };
  }
}
```

### Controller-Level Throttling

```typescript
import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller('api')
export class ApiController {
  // Override global throttling for specific endpoint
  @Throttle(10, 60000) // 10 requests per minute
  @Get('sensitive')
  getSensitiveData() {
    return { data: 'sensitive information' };
  }

  // Use global throttling
  @Get('public')
  getPublicData() {
    return { data: 'public information' };
  }
}
```

### Skip Throttling Conditionally

```typescript
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Skip throttling for admin users
    if (request.user?.role === 'admin') {
      return true;
    }

    // Skip throttling for health checks
    if (request.url === '/health') {
      return true;
    }

    return false;
  }
}
```

## Environment-Specific Configuration

### Development Environment

```bash
# .env.development
NODE_ENV=development
THROTTLER_TTL=60000        # 1 minute window
THROTTLER_LIMIT=200        # Higher limit for development
```

### Production Environment

```bash
# .env.production
NODE_ENV=production
THROTTLER_TTL=60000        # 1 minute window
THROTTLER_LIMIT=100        # Standard limit for production
```

### Testing Environment

```bash
# .env.test
NODE_ENV=test
# TTL and LIMIT ignored due to skipIf function
THROTTLER_TTL=1000
THROTTLER_LIMIT=1
```

### High-Traffic Production

```bash
# .env.production.high-traffic
NODE_ENV=production
THROTTLER_TTL=60000        # 1 minute window
THROTTLER_LIMIT=500        # Higher limit for high-traffic applications
```

## Common Rate Limiting Scenarios

### Conservative Rate Limiting

```bash
# Strict limits for sensitive APIs
THROTTLER_TTL=300000       # 5 minutes
THROTTLER_LIMIT=50         # 50 requests per 5 minutes
```

### Lenient Rate Limiting

```bash
# Generous limits for public APIs
THROTTLER_TTL=60000        # 1 minute
THROTTLER_LIMIT=1000       # 1000 requests per minute
```

### Burst Protection

```bash
# Short window with low limit to prevent bursts
THROTTLER_TTL=10000        # 10 seconds
THROTTLER_LIMIT=20         # 20 requests per 10 seconds
```

## Advanced Configuration

### Multiple Rate Limiting Rules

```typescript
// Custom configuration with multiple rules
import { ThrottlerModule } from '@nestjs/throttler';

ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 1000, // 1 second
    limit: 3, // 3 requests per second
  },
  {
    name: 'medium',
    ttl: 10000, // 10 seconds
    limit: 20, // 20 requests per 10 seconds
  },
  {
    name: 'long',
    ttl: 60000, // 1 minute
    limit: 100, // 100 requests per minute
  },
]);
```

### Storage Configuration

```typescript
// Using Redis for distributed rate limiting
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

ThrottlerModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    ...configService.get('throttlerConfig'),
    storage: new ThrottlerStorageRedisService('redis://localhost:6379'),
  }),
  inject: [ConfigService],
});
```

## Monitoring and Observability

### Throttling Metrics

```typescript
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class MetricsThrottlerGuard extends ThrottlerGuard {
  protected async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const canProceed = await super.handleRequest(context, limit, ttl);

    if (!canProceed) {
      // Log throttling event
      console.log('Request throttled', {
        ip: context.switchToHttp().getRequest().ip,
        url: context.switchToHttp().getRequest().url,
        limit,
        ttl,
      });
    }

    return canProceed;
  }
}
```

### Health Check Integration

```typescript
@Controller('health')
export class HealthController {
  constructor(private configService: ConfigService) {}

  @Get('throttler')
  getThrottlerHealth() {
    const config = this.configService.get<ThrottlerConfig>('throttlerConfig');

    return {
      status: 'ok',
      throttling: {
        enabled: !config.skipIf || !config.skipIf({}),
        ttl: config.ttl,
        limit: config.limit,
        ratePerSecond: config.limit / (config.ttl / 1000),
      },
    };
  }
}
```

## Security Considerations

### Rate Limiting Best Practices

1. **Choose appropriate limits** based on expected usage patterns
2. **Monitor for abuse patterns** and adjust limits accordingly
3. **Use different limits** for different endpoint types
4. **Consider user authentication** for personalized limits
5. **Implement graceful degradation** when limits are exceeded

### Protection Strategies

```typescript
// Different limits for different user types
@Injectable()
export class UserAwareThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: any): Promise<string> {
    // Use user ID for authenticated users
    if (req.user?.id) {
      return `user-${req.user.id}`;
    }

    // Fall back to IP for anonymous users
    return req.ip;
  }

  protected async getLimit(context: ExecutionContext): Promise<number> {
    const request = context.switchToHttp().getRequest();

    // Higher limits for premium users
    if (request.user?.plan === 'premium') {
      return 1000;
    }

    // Standard limits for regular users
    if (request.user?.plan === 'standard') {
      return 500;
    }

    // Lower limits for anonymous users
    return 100;
  }
}
```

## Troubleshooting

### Common Issues

1. **Tests failing due to throttling**
   - Verify `NODE_ENV=test` is set
   - Check that `skipIf` function returns `true` for tests

2. **Legitimate requests being throttled**
   - Review and adjust `THROTTLER_LIMIT`
   - Consider increasing `THROTTLER_TTL` for longer windows
   - Implement user-specific rate limiting

3. **Rate limiting not working**
   - Verify `ThrottlerModule` is properly configured
   - Check that `ThrottlerGuard` is applied globally or to specific routes
   - Ensure environment variables are loaded correctly

### Debug Configuration

```typescript
// Add to a debug controller
@Controller('debug')
export class DebugController {
  constructor(private configService: ConfigService) {}

  @Get('throttler')
  getThrottlerDebugInfo() {
    const config = this.configService.get<ThrottlerConfig>('throttlerConfig');

    return {
      environment: process.env.NODE_ENV,
      configuration: {
        ttl: config.ttl,
        limit: config.limit,
        skipIf: config.skipIf ? 'function defined' : 'undefined',
        isTestEnv: process.env.NODE_ENV === 'test',
      },
      calculated: {
        requestsPerSecond: config.limit / (config.ttl / 1000),
        windowInMinutes: config.ttl / 60000,
      },
    };
  }
}
```

### Testing Rate Limiting

```bash
# Test rate limiting with curl
for i in {1..10}; do
  curl -w "%{http_code}\n" -s -o /dev/null http://localhost:3000/api/test
  sleep 0.1
done

# Test with different IPs (if behind proxy)
curl -H "X-Forwarded-For: 192.168.1.1" http://localhost:3000/api/test
curl -H "X-Forwarded-For: 192.168.1.2" http://localhost:3000/api/test
```

## Performance Impact

### Memory Usage

- **In-memory storage**: Linear growth with number of unique clients
- **Redis storage**: Recommended for distributed applications
- **Cleanup**: Automatic cleanup of expired entries

### Response Time

- **Overhead**: Minimal (<1ms) for in-memory storage
- **Network overhead**: Additional latency when using Redis
- **Optimization**: Consider async processing for high-traffic scenarios

## Related Files

- `src/config/index.ts` - Barrel export for all configuration modules
- `src/app.module.ts` - ThrottlerModule registration
- `docs/THROTTLER.md` - Additional throttling documentation
- `src/shared/guards/` - Custom throttler guard implementations

## Migration Notes

When updating throttler configuration:

1. **Test thoroughly** with realistic traffic patterns
2. **Monitor application performance** after changes
3. **Coordinate with frontend teams** on expected rate limits
4. **Update API documentation** with new rate limiting information
5. **Consider backward compatibility** for existing clients
6. **Implement gradual rollout** for production changes

## Related Documentation

- [NestJS Throttler Documentation](https://docs.nestjs.com/security/rate-limiting)
- [Fastify Rate Limiting](https://github.com/fastify/fastify-rate-limit)
- [Redis Storage Provider](https://github.com/jmcdo29/nestjs-throttler-storage-redis)
