# Cookie Configuration

## Overview

The `cookieConfig.ts` module provides centralized configuration management for cookies in the NestJS application using the `@fastify/cookie` plugin. This configuration ensures secure and properly configured cookies based on the application's environment and follows security best practices.

## Dependencies

- `@fastify/cookie`: Fastify plugin for cookie handling
- `@nestjs/config`: NestJS configuration management

## Configuration Structure

The module exports a configuration object that implements `FastifyCookieOptions` interface from `@fastify/cookie`.

### Configuration Properties

```typescript
interface CookieConfigOptions {
  secret: string; // Secret for signing cookies
  hook: 'onRequest'; // Fastify hook for cookie parsing
  parseOptions: {
    secure: boolean; // HTTPS-only cookies
    httpOnly: boolean; // Prevent XSS attacks
    sameSite: 'lax' | 'none' | 'strict' | undefined; // CSRF protection
    path: string; // Cookie path
    signed: boolean; // Sign cookies for integrity
    domain?: string; // Cookie domain (optional)
  };
}
```

## Environment Variables

The configuration reads from the following environment variables:

| Environment Variable | Default Value                                    | Type    | Description                                        |
| -------------------- | ------------------------------------------------ | ------- | -------------------------------------------------- |
| `APP_ENV`            | `'development'`                                  | string  | Determines production vs development settings      |
| `COOKIE_SECRET`      | `'MAw5YjhDo8QZoTnuvXlsZwnPvfkynQmUWQjnQIyeoPs='` | string  | Secret key for signing cookies                     |
| `COOKIE_HTTP_ONLY`   | `false`                                          | boolean | When `'true'`, enables httpOnly flag               |
| `COOKIE_SAME_SITE`   | Environment-dependent                            | string  | SameSite attribute (`'lax'`, `'none'`, `'strict'`) |
| `COOKIE_DOMAIN`      | `undefined`                                      | string  | Optional domain for cookies                        |

## SameSite Logic

The `getSameSite()` function implements intelligent defaults for the SameSite attribute:

### Validation Rules

- Validates against allowed values: `['lax', 'none', 'strict']`
- Falls back to environment-based defaults if invalid or unset

### Default Behavior

- **Production**: Defaults to `'lax'` for better security
- **Development/Other**: Defaults to `'none'` for development flexibility

```typescript
const getSameSite = (): 'lax' | 'none' | 'strict' | undefined => {
  const allowedSameSite = ['lax', 'none', 'strict'];
  const sameSite = process.env.COOKIE_SAME_SITE;

  if (sameSite && allowedSameSite.includes(sameSite)) {
    return sameSite as 'lax' | 'none' | 'strict';
  }

  return process.env.APP_ENV === 'production' ? 'lax' : 'none';
};
```

## Security Features

### Production Environment

- **Secure**: `true` - Cookies only sent over HTTPS
- **Signed**: `true` - Cookies are signed for integrity verification
- **SameSite**: `'lax'` by default - Protection against CSRF attacks

### Development Environment

- **Secure**: `false` - Allows HTTP for local development
- **Signed**: `false` - Simplified debugging
- **SameSite**: `'none'` by default - Flexibility for development

## Usage

### Basic Integration

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { cookieConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [cookieConfig],
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

### Accessing Cookie Configuration

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyCookieOptions } from '@fastify/cookie';

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}

  getCookieConfig(): FastifyCookieOptions {
    return this.configService.get<FastifyCookieOptions>('cookieConfig');
  }

  getCookieSecret(): string {
    return this.configService.get<string>('cookieConfig.secret');
  }
}
```

### Setting Cookies in Controllers

```typescript
import { Controller, Post, Reply } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Reply() reply: FastifyReply) {
    // Set a secure cookie
    reply.setCookie('sessionId', 'abc123', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 3600000, // 1 hour
    });

    return { message: 'Logged in successfully' };
  }
}
```

## Environment-Specific Configuration

### Development Environment

```bash
# .env.development
APP_ENV=development
COOKIE_SECRET=dev-secret-key-change-in-production
COOKIE_HTTP_ONLY=false
COOKIE_SAME_SITE=none
# COOKIE_DOMAIN not set for localhost
```

### Production Environment

```bash
# .env.production
APP_ENV=production
COOKIE_SECRET=super-secure-random-string-32-chars-min
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=lax
COOKIE_DOMAIN=.yourdomain.com
```

### Testing Environment

```bash
# .env.test
APP_ENV=test
COOKIE_SECRET=test-secret-key
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=strict
```

## Security Best Practices

### Cookie Secret

- **Development**: Use a simple secret for ease of debugging
- **Production**: Use a cryptographically secure random string (minimum 32 characters)
- **Rotation**: Regularly rotate the cookie secret in production

### SameSite Values

- **`strict`**: Highest security, cookies never sent with cross-site requests
- **`lax`**: Good balance, cookies sent with safe cross-site requests (GET)
- **`none`**: Least restrictive, requires `secure: true` in modern browsers

### HttpOnly Flag

- **Enable in production**: Prevents XSS attacks by blocking JavaScript access
- **Optional in development**: May disable for debugging purposes

## Common Use Cases

### Session Management

```typescript
// Set session cookie
reply.setCookie('sessionId', sessionToken, {
  httpOnly: true,
  secure: process.env.APP_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});
```

### CSRF Token

```typescript
// Set CSRF token cookie
reply.setCookie('csrf-token', csrfToken, {
  httpOnly: false, // Needs to be readable by frontend
  secure: process.env.APP_ENV === 'production',
  sameSite: 'strict',
});
```

### Remember Me Token

```typescript
// Set long-term remember me cookie
reply.setCookie('remember-token', rememberToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
});
```

## Troubleshooting

### Common Issues

1. **Cookies not working in development**
   - Check if `secure: false` for HTTP
   - Verify `sameSite: 'none'` for cross-origin requests

2. **Cookies not sent from frontend**
   - Ensure `credentials: 'include'` in fetch requests
   - Check CORS configuration allows credentials

3. **SameSite warnings in browser**
   - Update to explicit SameSite values
   - Use `secure: true` with `sameSite: 'none'`

### Debug Configuration

```typescript
// Add to a debug controller
@Get('cookie-config')
getCookieConfig() {
  return {
    environment: process.env.APP_ENV,
    hasSecret: !!process.env.COOKIE_SECRET,
    httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
    sameSite: getSameSite(),
    domain: process.env.COOKIE_DOMAIN || 'not set'
  };
}
```

## Related Files

- `src/config/index.ts` - Barrel export for all configuration modules
- `src/main.ts` - Cookie plugin registration
- `src/config/corsConfig.ts` - Related CORS configuration for cookies

## Migration Notes

When updating cookie configuration:

1. **Test thoroughly** in all environments
2. **Consider browser compatibility** for SameSite changes
3. **Update documentation** for any new environment variables
4. **Review security implications** of any changes
5. **Coordinate with frontend team** for cross-origin scenarios
