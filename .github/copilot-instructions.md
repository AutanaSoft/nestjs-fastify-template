# NestJS Fastify Template - Coding Instructions

## Language Guidelines

Always respond in Spanish when communicating with developers, but keep all code, comments, documentation, and technical content in English. This ensures consistency with international development standards while providing explanations in Spanish.

## File Creation Guidelines

Only create test files (`.spec.ts`, `.e2e-spec.ts`) or documentation files (`.md`) when explicitly requested by the developer. Focus on implementing core functionality and business logic unless specifically asked to add tests or documentation.

## Architecture Overview

This is a NestJS TypeScript template using Fastify as the HTTP adapter with production-ready security features, centralized configuration, and hexagonal architecture patterns.

### Key Components

- Platform: Fastify adapter (`@nestjs/platform-fastify`) with security plugins (helmet, CORS, CSRF, cookies)
- Configuration: Typed factory pattern with environment-aware defaults in `src/config/`
- Security: Global throttling, CORS whitelist, secure cookies, and correlation ID tracking
- Logging: Structured Pino logging with file rotation and environment-specific levels
- Architecture: Hexagonal/Clean Architecture with domain, application, and infrastructure layers

## Bootstrap Process

The application follows a specific initialization sequence in `src/main.ts`:

1. Create Fastify NestApplication with buffered logs
2. Load typed configurations from ConfigService
3. Register Fastify plugins (helmet, CORS, cookies, CSRF) in order
4. Apply global validation pipe with whitelist/transform
5. Setup Swagger documentation at `/docs`
6. Listen on configured port with startup logging

## Configuration System

All configuration is centralized in `src/config/` using typed factory pattern:

```typescript
export type MyConfig = {
  property: string;
};

export default registerAs(
  'myConfig',
  (): MyConfig => ({
    property: process.env.MY_PROPERTY || 'default',
  }),
);
```

Critical configs: appConfig (ports/env), corsConfig (whitelist), cookieConfig (security), throttlerConfig (rate limiting).
Register new configs in `AppModule.imports` ConfigModule.forRoot({ load: [...] }).

## Security Architecture

- Throttling: Global rate limiting via ThrottlerGuard (auto-disabled in tests)
- CORS: Environment-aware whitelist (`corsConfig.ts` - permissive in dev, strict in prod)
- Cookies: Adaptive security (`cookieConfig.ts` - signed/secure in prod, relaxed in dev)
- Correlation ID: Global interceptor for request tracing (`CorrelationIdInterceptor`)

## Module Structure (Hexagonal Architecture)

Follow this structure for new modules:

```
src/modules/moduleName/
├── module-name.module.ts    # Module registration (controllers + providers)
├── application/             # Use cases and DTOs (app layer)
│   ├── dto/                # Request/response DTOs with validation
│   └── use-cases/          # Business logic orchestration
├── domain/                 # Pure business logic (no dependencies)
│   └── services/           # Domain services
└── infrastructure/         # External concerns (controllers, adapters)
    └── controllers/        # HTTP controllers with Swagger docs
```

## Development Commands

- `pnpm start:dev` - Development with hot reload and debug logging
- `pnpm test` - Full test suite (unit + e2e + coverage merge)
- `pnpm test:unit` - Unit tests only with coverage
- `pnpm test:e2e` - E2E tests with supertest
- `pnpm lint` - ESLint with auto-fix (flat config format)
- `pnpm format` - Prettier formatting

## Testing Strategy

- Unit tests: Located in `tests/src/` with TestingModule pattern
- E2E tests: Located in `tests/e2e/` using supertest against HTTP endpoints
- Coverage: Separate reports merged via `scripts/merge-coverage.ts`
- Jest config: Uses @swc/jest for fast compilation, covers all `src/**/*.(t|j)s`

## Code Quality Standards

- ESLint: Flat config with TypeScript strict rules, `@typescript-eslint/no-explicit-any: off`
- Commitlint: Enforced conventional commits with custom scope rules
- Validation: Global ValidationPipe with `whitelist: true, transform: true`
- Swagger: Automatic OpenAPI docs with `@ApiTags`, `@ApiOperation`, `@ApiResponse`

## Import Pattern

Use barrel exports with `index.ts` files for clean imports:

```typescript
// src/config/index.ts
export { default as appConfig, AppConfig } from './appConfig';
export { default as corsConfig } from './corsConfig';
```

This enables `import { appConfig, AppConfig } from '@config'` instead of relative paths.

## Environment Configuration

Development defaults: APP_PORT=4200, LOG_LEVEL=debug, permissive CORS
Production requirements: Set `APP_ENV=production`, `COOKIE_SECRET`, `CORS_ORIGIN_WHITELIST`

Key variables:

- `APP_PORT` (default: 4200) - Server port
- `APP_PREFIX` (default: 'v1') - API path prefix
- `APP_LOG_LEVEL` (default: 'debug') - Pino log level
- `CORS_ORIGIN_WHITELIST` - Comma-separated allowed origins
- `COOKIE_SECRET` - Required for signed cookies in production
- `THROTTLER_LIMIT/TTL` - Rate limiting configuration

## Testing Patterns

For E2E tests, always include ValidationPipe:

```typescript
const moduleFixture: TestingModule = await Test.createTestingModule({
  imports: [HelloModule],
}).compile();

app = moduleFixture.createNestApplication();
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

When adding modules, follow the hexagonal pattern with proper DTO validation, use cases, and comprehensive E2E tests.
