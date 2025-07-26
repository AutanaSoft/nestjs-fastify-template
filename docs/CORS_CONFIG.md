# CORS Configuration

## Overview

The `corsConfig.ts` module provides centralized CORS (Cross-Origin Resource Sharing) configuration management for the NestJS application using the `@fastify/cors` plugin. This configuration implements a secure origin whitelist system with environment-specific behavior for development and production environments.

## Dependencies

- `@fastify/cors`: Fastify plugin for CORS handling
- `@nestjs/config`: NestJS configuration management

## Configuration Structure

The module exports a configuration object that implements `FastifyCorsOptions` interface from `@fastify/cors`.

### Configuration Properties

```typescript
interface CorsConfigOptions {
  origin: (origin: string, callback: Function) => void; // Dynamic origin validation
  methods: string; // Allowed HTTP methods
  preflightContinue: boolean; // Preflight handling
  optionsSuccessStatus: number; // SUCCESS status for OPTIONS
  credentials: boolean; // Include credentials
  allowedHeaders: string; // Allowed request headers
  exposedHeaders: string; // Headers exposed to client
}
```

## Environment Variables

The configuration reads from the following environment variables:

| Environment Variable    | Default Value                                                                  | Type   | Description                               |
| ----------------------- | ------------------------------------------------------------------------------ | ------ | ----------------------------------------- |
| `CORS_ORIGIN_WHITELIST` | `''`                                                                           | string | Comma-separated list of allowed origins   |
| `NODE_ENV`              | `undefined`                                                                    | string | Environment mode for development behavior |
| `CORS_METHODS`          | `'GET,HEAD,PUT,PATCH,POST,DELETE'`                                             | string | Allowed HTTP methods                      |
| `CORS_ALLOWED_HEADERS`  | `'Content-Type,Authorization,Accept,Origin,X-Requested-With,X-Correlation-Id'` | string | Headers allowed in requests               |
| `CORS_EXPOSED_HEADERS`  | `'X-Total-Count,X-Correlation-Id'`                                             | string | Headers exposed to the client             |

## Origin Whitelist Logic

The module implements intelligent origin validation with environment-specific behavior:

### Development Environment

- **Empty whitelist**: Allows any origin for development flexibility
- **Condition**: `NODE_ENV !== 'production'` AND whitelist is empty

### Production Environment

- **Strict validation**: Only whitelisted origins are allowed
- **No origin requests**: Allows requests without origin (e.g., Postman, mobile apps)

### Origin Validation Function

```typescript
origin: (origin, callback) => {
  // Development: Allow any origin if whitelist is empty
  if (
    process.env.NODE_ENV !== 'production' &&
    originWhitelist.length === 1 &&
    originWhitelist[0] === ''
  ) {
    return callback(null, true);
  }

  // Allow no-origin requests and whitelisted origins
  if (!origin || originWhitelist.indexOf(origin) !== -1) {
    callback(null, true);
  } else {
    // Reject other origins
    callback(new Error('Not allowed by CORS'), false);
  }
};
```

## Default Headers

### Allowed Headers

Standard headers permitted in cross-origin requests:

- `Content-Type`: For request body content type
- `Authorization`: For authentication tokens
- `Accept`: For content negotiation
- `Origin`: Browser-set origin header
- `X-Requested-With`: For AJAX request identification
- `X-Correlation-Id`: For request tracking

### Exposed Headers

Headers that the client-side code can access:

- `X-Total-Count`: For pagination information
- `X-Correlation-Id`: For request correlation tracking

## Usage

### Basic Integration

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { corsConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [corsConfig],
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

### Accessing CORS Configuration

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyCorsOptions } from '@fastify/cors';

@Injectable()
export class CorsService {
  constructor(private configService: ConfigService) {}

  getCorsConfig(): FastifyCorsOptions {
    return this.configService.get<FastifyCorsOptions>('corsConfig');
  }

  getAllowedOrigins(): string[] {
    const whitelist = process.env.CORS_ORIGIN_WHITELIST || '';
    return whitelist.split(',').filter(origin => origin.trim() !== '');
  }
}
```

### Registration in Main Application

```typescript
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const configService = app.get(ConfigService);
  const corsConfig = configService.get('corsConfig');

  // Register CORS plugin
  await app.register(require('@fastify/cors'), corsConfig);

  await app.listen(3000);
}
bootstrap();
```

## Environment-Specific Configuration

### Development Environment

```bash
# .env.development
NODE_ENV=development
# Leave CORS_ORIGIN_WHITELIST empty to allow any origin
CORS_ORIGIN_WHITELIST=
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,Accept,Origin,X-Requested-With,X-Correlation-Id,X-Debug-Mode
CORS_EXPOSED_HEADERS=X-Total-Count,X-Correlation-Id,X-Debug-Info
```

### Production Environment

```bash
# .env.production
NODE_ENV=production
# Specify allowed origins (comma-separated)
CORS_ORIGIN_WHITELIST=https://app.yourdomain.com,https://admin.yourdomain.com
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE
CORS_ALLOWED_HEADERS=Content-Type,Authorization,Accept,Origin,X-Requested-With,X-Correlation-Id
CORS_EXPOSED_HEADERS=X-Total-Count,X-Correlation-Id
```

### Staging Environment

```bash
# .env.staging
NODE_ENV=staging
CORS_ORIGIN_WHITELIST=https://staging-app.yourdomain.com,https://staging-admin.yourdomain.com
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE
CORS_ALLOWED_HEADERS=Content-Type,Authorization,Accept,Origin,X-Requested-With,X-Correlation-Id
CORS_EXPOSED_HEADERS=X-Total-Count,X-Correlation-Id
```

## Security Considerations

### Origin Whitelist Best Practices

1. **Production**: Always specify explicit origins
2. **Development**: Use empty whitelist for flexibility
3. **Staging**: Mirror production origins with staging domains

### Credentials Handling

The configuration sets `credentials: true` which:

- Allows cookies and authorization headers in cross-origin requests
- Requires explicit origin specification (cannot use `*`)
- Works with the whitelist-based origin validation

### Common Security Patterns

```typescript
// Secure production whitelist
const productionOrigins = [
  'https://app.yourdomain.com',
  'https://admin.yourdomain.com',
  'https://dashboard.yourdomain.com',
];

// Development with specific local origins
const developmentOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
];
```

## Advanced Usage

### Dynamic Origin Validation

```typescript
// Custom origin validation logic
const customOriginValidator = (origin: string, callback: Function) => {
  // Allow subdomains of your domain
  if (origin && origin.match(/^https:\/\/[\w-]+\.yourdomain\.com$/)) {
    return callback(null, true);
  }

  // Allow specific origins
  const allowedOrigins = process.env.CORS_ORIGIN_WHITELIST?.split(',') || [];
  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  callback(new Error('Not allowed by CORS'), false);
};
```

### Conditional Headers

```typescript
// Environment-specific headers
const getAllowedHeaders = () => {
  const baseHeaders = 'Content-Type,Authorization,Accept,Origin,X-Requested-With';

  if (process.env.NODE_ENV === 'development') {
    return `${baseHeaders},X-Debug-Mode,X-Test-Header`;
  }

  return `${baseHeaders},X-Correlation-Id`;
};
```

## Common CORS Scenarios

### Single Page Application (SPA)

```bash
# Frontend at different domain
CORS_ORIGIN_WHITELIST=https://app.example.com
CORS_METHODS=GET,POST,PUT,DELETE
CORS_ALLOWED_HEADERS=Content-Type,Authorization
```

### Mobile Application

```bash
# Mobile apps don't send Origin header
CORS_ORIGIN_WHITELIST=
# Origin validation will allow null/undefined origins
```

### Multiple Frontends

```bash
# Multiple client applications
CORS_ORIGIN_WHITELIST=https://web.example.com,https://admin.example.com,https://mobile.example.com
```

## Troubleshooting

### Common CORS Issues

1. **"Access-Control-Allow-Origin" error**
   - Check if origin is in whitelist
   - Verify NODE_ENV setting for development

2. **Preflight request failing**
   - Ensure OPTIONS method is allowed
   - Check allowed headers configuration

3. **Credentials not being sent**
   - Verify `credentials: true` in CORS config
   - Check frontend sends `credentials: 'include'`

### Debug Configuration

```typescript
// Add to a debug controller
@Get('cors-config')
getCorsConfig() {
  const whitelist = process.env.CORS_ORIGIN_WHITELIST || '';
  return {
    environment: process.env.NODE_ENV,
    originWhitelist: whitelist.split(','),
    allowsAnyOriginInDev: process.env.NODE_ENV !== 'production' && whitelist === '',
    methods: process.env.CORS_METHODS || 'default methods',
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS || 'default headers',
    exposedHeaders: process.env.CORS_EXPOSED_HEADERS || 'default exposed'
  };
}
```

### Testing CORS Configuration

```bash
# Test with curl
curl -H "Origin: https://example.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3000/api/test

# Check response headers
curl -i -H "Origin: https://example.com" \
     http://localhost:3000/api/test
```

## Related Files

- `src/config/index.ts` - Barrel export for all configuration modules
- `src/config/cookieConfig.ts` - Related cookie configuration
- `src/main.ts` - CORS plugin registration
- `docs/COOKIE_CONFIG.md` - Cookie configuration documentation

## Migration Notes

When updating CORS configuration:

1. **Test thoroughly** with actual frontend applications
2. **Validate origin patterns** against your domain structure
3. **Review security implications** of any whitelist changes
4. **Coordinate with frontend teams** on header requirements
5. **Monitor for CORS errors** in production logs
6. **Document any custom headers** for API consumers

## Performance Considerations

- **Origin validation** is called for every cross-origin request
- **Keep whitelist small** for better performance
- **Consider regex patterns** for subdomain matching if needed
- **Cache validation results** if implementing complex logic
